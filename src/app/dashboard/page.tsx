import { prisma } from "@/lib/prisma";
import { Home, ClipboardList, Users, TrendingUp, TrendingDown, LineChart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const chaletsCount = await prisma.chalet.count();
  const activeReservationsCount = await prisma.reservation.count({
    where: { status: { in: ['معلق', 'مؤكد'] } }
  });
  const clientsCount = await prisma.client.count();
  
  // Calculate revenue/expenses/profits
  const payments = await prisma.payment.findMany();
  const expenses = await prisma.expense.findMany();
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;

  // Format currency
  const formatCur = (num: number) => new Intl.NumberFormat('ar-SA').format(num) + ' ر.س';

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Chalets */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#d4a853]"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#d4a853]/20 flex items-center justify-center">
              <Home className="text-[#d4a853]" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{chaletsCount}</div>
          <div className="text-[#8b92a5] text-sm">إجمالي الشاليهات</div>
        </div>

        {/* Active Reservations */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ClipboardList className="text-green-500" size={24} />
            </div>
            <span className="text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded">+{activeReservationsCount}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeReservationsCount}</div>
          <div className="text-[#8b92a5] text-sm">الحجوزات النشطة</div>
        </div>

        {/* Clients */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{clientsCount}</div>
          <div className="text-[#8b92a5] text-sm">العملاء</div>
        </div>

        {/* Total Revenue */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCur(totalRevenue)}</div>
          <div className="text-[#8b92a5] text-sm">الإيرادات</div>
        </div>

        {/* Total Expenses */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <TrendingDown className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCur(totalExpenses)}</div>
          <div className="text-[#8b92a5] text-sm">المصروفات</div>
        </div>

        {/* Net Profit */}
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-2 h-full ${totalProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${totalProfit >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <LineChart className={totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'} size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCur(totalProfit)}</div>
          <div className="text-[#8b92a5] text-sm">صافي الربح</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Recent Reservations */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-4">آخر الحجوزات</h3>
          <div className="text-center text-[#8b92a5] py-8">
            سيتم إضافة الجدول هنا
          </div>
        </div>

        {/* Placeholder for Notifications */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-4">التنبيهات التلقائية</h3>
          <div className="text-center text-[#8b92a5] py-8">
            سيتم إضافة التنبيهات هنا
          </div>
        </div>
      </div>
    </div>
  );
}
