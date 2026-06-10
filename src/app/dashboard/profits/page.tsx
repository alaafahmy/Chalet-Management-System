import { prisma } from "@/lib/prisma";
import { LineChart, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProfitsPage() {
  const payments = await prisma.payment.findMany();
  const expenses = await prisma.expense.findMany();
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const formatCur = (num: number) => new Intl.NumberFormat('ar-SA').format(num) + ' ر.س';

  // Group by month for chart placeholder
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-[#d4a853]/20 text-[#d4a853] p-2 rounded-lg"><LineChart size={24} /></span> التقارير المالية والأرباح
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1 bg-purple-500"></div>
          <DollarSign className="text-purple-500 mb-2" size={32} />
          <div className="text-[#8b92a5] text-sm mb-1">إجمالي الإيرادات</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2">
            {formatCur(totalRevenue)}
            <ArrowUpRight className="text-emerald-500" size={20} />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1 bg-orange-500"></div>
          <DollarSign className="text-orange-500 mb-2" size={32} />
          <div className="text-[#8b92a5] text-sm mb-1">إجمالي المصروفات</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2">
            {formatCur(totalExpenses)}
            <ArrowDownRight className="text-red-500" size={20} />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group bg-gradient-to-b from-transparent to-[#d4a853]/5 border-[#d4a853]/30">
          <div className={`absolute top-0 right-0 w-full h-1 ${netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <LineChart className={netProfit >= 0 ? "text-emerald-500 mb-2" : "text-red-500 mb-2"} size={32} />
          <div className="text-[#8b92a5] text-sm mb-1">صافي الربح</div>
          <div className={`text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCur(netProfit)}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-white mb-6">الأرباح الشهرية (2026)</h3>
        
        <div className="h-64 flex items-end gap-2 px-4 pb-8 border-b border-[var(--color-border-subtle)] relative">
          {months.map((m, i) => {
            const height = Math.max(10, Math.random() * 100);
            return (
              <div key={m} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-[#b18532] to-[#d4a853] rounded-t-sm transition-all group-hover:brightness-125 relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[var(--color-bg-base)] text-xs py-1 px-2 rounded border border-[var(--color-border-subtle)] whitespace-nowrap z-10 transition-opacity">
                    {formatCur(height * 1000)}
                  </div>
                </div>
                <div className="absolute -bottom-6 text-xs text-[#8b92a5] rotate-45 transform origin-left">
                  {m}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
