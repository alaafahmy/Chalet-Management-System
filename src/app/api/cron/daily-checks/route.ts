import { NextResponse } from "next/server";
import { checkTodayCheckouts, checkLargeExpenses } from "@/lib/notifications";

/**
 * GET /api/cron/daily-checks
 * يُستدعى يومياً (يمكن استدعاؤه من Vercel Cron أو أي scheduler خارجي)
 * أو استدعاؤه يدوياً عند فتح النظام من header.tsx
 */
export async function GET(request: Request) {
  try {
    // فحص حجوزات الخروج اليوم
    const checkoutResult = await checkTodayCheckouts();

    // فحص المصروفات الكبيرة (أعلى من 5000 ر.س)
    await checkLargeExpenses(5000);

    return NextResponse.json({
      success: true,
      checkoutsToday: checkoutResult.checked,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily check error:", error);
    return NextResponse.json({ error: "فشل الفحص اليومي" }, { status: 500 });
  }
}
