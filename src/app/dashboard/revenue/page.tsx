import { prisma } from "@/lib/prisma";
import { Plus, TrendingUp } from "lucide-react";
import { formatRefID } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function RevenuePage() {
  const payments = await prisma.payment.findMany({
    include: {
      reservation: {
        include: { client: true, chalet: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  const formatCur = (num: number) => new Intl.NumberFormat('ar-SA').format(num) + ' ر.س';
  const formatDate = (date: Date) => date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'نقد':
        return <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">نقد</span>;
      case 'تحويل بنكي':
        return <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">تحويل بنكي</span>;
      default:
        return <span className="bg-purple-500/20 text-purple-500 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">{method}</span>;
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-purple-500/20 text-purple-500 p-2 rounded-lg"><TrendingUp size={24} /></span> سجل الإيرادات
        </h2>
      </div>

      {/* Summary Card */}
      <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
        <div className="text-[#8b92a5] text-sm mb-1">إجمالي الإيرادات المحصلة</div>
        <div className="text-4xl font-bold text-purple-400">{formatCur(totalRevenue)}</div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#d4a853] text-[#06080d]">
              <tr>
                <th className="px-6 py-4 font-bold">الرقم المرجعي</th>
                <th className="px-6 py-4 font-bold">العميل</th>
                <th className="px-6 py-4 font-bold">الشاليه</th>
                <th className="px-6 py-4 font-bold">المبلغ المحصل</th>
                <th className="px-6 py-4 font-bold">طريقة الدفع</th>
                <th className="px-6 py-4 font-bold">تاريخ التحصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[#f5f5f5]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[var(--color-bg-input)]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d4a853]">{formatRefID(p.id, 'PAY')}</td>
                  <td className="px-6 py-4 font-bold">{p.reservation.client.name}</td>
                  <td className="px-6 py-4">{p.reservation.chalet.name}</td>
                  <td className="px-6 py-4 font-bold text-emerald-500">{formatCur(p.amount)}</td>
                  <td className="px-6 py-4">{getMethodBadge(p.method)}</td>
                  <td className="px-6 py-4 text-[#8b92a5]">{formatDate(p.date)}</td>
                </tr>
              ))}
              
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8b92a5]">
                    <div className="text-4xl mb-4">📈</div>
                    <h4 className="text-lg font-bold text-white mb-2">لا توجد إيرادات مسجلة</h4>
                    <p>الإيرادات الناتجة عن الحجوزات ستظهر هنا</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
