import { cookies } from "next/headers";

export async function requireAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    throw new Error("غير مصرح - يجب تسجيل الدخول");
  }

  try {
    const sessionData = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf-8"));
    if (!sessionData || !sessionData.id) {
      throw new Error("غير مصرح - بيانات الجلسة غير صالحة");
    }
    return sessionData;
  } catch (e) {
    throw new Error("غير مصرح - جلسة غير صالحة");
  }
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.roleAr) && !allowedRoles.includes(user.role)) {
    throw new Error("غير مصرح - صلاحيات غير كافية");
  }
  
  return user;
}
