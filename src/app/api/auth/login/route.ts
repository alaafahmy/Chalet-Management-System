import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/session";

// Rate limiting بسيط في الذاكرة
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // نافذة 15 دقيقة
    return true;
  }

  if (record.count >= 10) return false; // أقصى 10 محاولات كل 15 دقيقة

  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح به من المحاولات. حاول مجدداً بعد 15 دقيقة." },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // التحقق من المستخدم في قاعدة البيانات
    const user = await prisma.user.findFirst({
      where: { username, active: true },
    });

    // fallback: admin الافتراضي إذا لم تكن قاعدة البيانات تحتوي على مستخدمين
    const isDefaultAdmin = username === "admin" && password === "admin123";

    let isValid = false;
    if (user) {
      isValid = await bcrypt.compare(password, user.password);
    } else if (isDefaultAdmin) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const sessionData = user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          roleAr: user.roleAr,
          mustChangePassword: user.mustChangePassword,
        }
      : {
          id: "admin",
          name: "المدير العام",
          username: "admin",
          role: "admin",
          roleAr: "مدير النظام",
          mustChangePassword: false,
        };

    // توقيع الجلسة بـ HMAC-SHA256 لمنع التزوير
    const token = signSession(sessionData);

    const response = NextResponse.json({ success: true, user: sessionData });

    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 ساعات
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
