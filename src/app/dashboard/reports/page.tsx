import { prisma } from "@/lib/prisma";
import ReportsClient from "@/components/ReportsClient";
import { requirePermission } from "@/lib/auth";
import { FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  await requirePermission("view_financial_reports");

  const chalets = await prisma.chalet.findMany({
    select: { id: true, name: true, type: true }
  });

  const revenues = await prisma.revenue.findMany({
    select: { amount: true, revenue_date: true, chalet_id: true }
  });

  const expenses = await prisma.expense.findMany({
    select: { amount: true, createdAt: true, chaletId: true }
  });

  const reservations = await prisma.reservation.findMany({
    where: { status: { in: ['مؤكد', 'مكتمل'] } },
    select: { id: true, chaletId: true, checkIn: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center hide-print">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-indigo-500/20 text-indigo-500 p-2 rounded-lg"><FileText size={24} /></span> التقارير الشاملة
        </h2>
      </div>
      <ReportsClient 
        chalets={chalets} 
        revenues={revenues} 
        expenses={expenses} 
        reservations={reservations} 
      />
    </div>
  );
}
