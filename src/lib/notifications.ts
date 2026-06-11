/**
 * مكتبة الإشعارات التلقائية
 * تُولِّد إشعارات فعلية في جدول Notification عند الأحداث المهمة
 */
import { prisma } from "./prisma";

type NotificationParams = {
  title: string;
  description: string;
  type: "reservation" | "expense" | "maintenance" | "payment" | "system";
  priority?: "low" | "medium" | "high";
};

export async function createNotification({
  title,
  description,
  type,
  priority = "medium",
}: NotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        title,
        description,
        type,
        priority,
        read: false,
        date: new Date(),
      },
    });
  } catch (e) {
    console.error("Failed to create notification:", e);
  }
}

/**
 * فحص الحجوزات المنتهية اليوم وإنشاء إشعارات تلقائية
 * يُستدعى من API endpoint أو cron job
 */
export async function checkTodayCheckouts() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkoutsToday = await prisma.reservation.findMany({
      where: {
        status: "مؤكد",
        checkOut: { gte: today, lt: tomorrow },
      },
      include: {
        client: { select: { name: true } },
        chalet: { select: { name: true } },
        payments: { select: { amount: true } },
      },
    });

    for (const res of checkoutsToday) {
      const paid = res.payments.reduce((s, p) => s + p.amount, 0);
      const remaining = res.totalCost - paid;

      // تنبيه موعد الخروج
      await createNotification({
        title: "موعد خروج اليوم",
        description: `الحجز للعميل "${res.client.name}" في شاليه "${res.chalet.name}" موعد خروجه اليوم`,
        type: "reservation",
        priority: "high",
      });

      // تنبيه إضافي إذا يوجد مبلغ غير مسدد
      if (remaining > 0.01) {
        await createNotification({
          title: "مبلغ غير مسدد عند الخروج",
          description: `العميل "${res.client.name}" لديه مبلغ متبقي ${new Intl.NumberFormat("ar-SA").format(remaining)} ر.س غير مسدد`,
          type: "payment",
          priority: "high",
        });
      }
    }

    return { checked: checkoutsToday.length };
  } catch (e) {
    console.error("Checkout check failed:", e);
    return { checked: 0 };
  }
}

/**
 * فحص المصروفات الكبيرة (أعلى من حد معين)
 */
export async function checkLargeExpenses(thresholdAmount = 5000) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const largeExpenses = await prisma.expense.findMany({
      where: {
        date: { gte: today, lt: tomorrow },
        amount: { gte: thresholdAmount },
      },
      include: { chalet: { select: { name: true } } },
    });

    for (const exp of largeExpenses) {
      // تحقق من عدم وجود إشعار سابق لنفس المصروف
      const existing = await prisma.notification.findFirst({
        where: {
          description: { contains: exp.id },
        },
      });
      if (existing) continue;

      await createNotification({
        title: "مصروف كبير مسجَّل",
        description: `تم تسجيل مصروف بقيمة ${new Intl.NumberFormat("ar-SA").format(exp.amount)} ر.س (${exp.type})${exp.chalet ? ` للشاليه "${exp.chalet.name}"` : " — عام"} | المعرف: ${exp.id}`,
        type: "expense",
        priority: "medium",
      });
    }
  } catch (e) {
    console.error("Large expense check failed:", e);
  }
}
