import { prisma } from "@/lib/prisma";
import { Plus, CheckCircle, Wrench } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const maintenances = await prisma.maintenance.findMany({
    include: { chalet: true },
    orderBy: { date: 'desc' }
  });

  const formatDate = (date: Date) => date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatCur = (num: number) => new Intl.NumberFormat('ar-SA').format(num) + ' ر.س';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-orange-500/20 text-orange-500 p-2 rounded-lg"><Wrench size={24} /></span> إدارة الصيانة
        </h2>
        <button className="bg-gradient-to-r from-[#d4a853] to-[#b18532] text-[#06080d] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} /> طلب صيانة جديد
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#d4a853] text-[#06080d]">
              <tr>
                <th className="px-6 py-4 font-bold">رقم الطلب</th>
                <th className="px-6 py-4 font-bold">الشاليه</th>
                <th className="px-6 py-4 font-bold">نوع الصيانة</th>
                <th className="px-6 py-4 font-bold">التكلفة</th>
                <th className="px-6 py-4 font-bold">تاريخ الطلب</th>
                <th className="px-6 py-4 font-bold">تاريخ الانتهاء</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[#f5f5f5]">
              {maintenances.map(m => (
                <tr key={m.id} className="hover:bg-[var(--color-bg-input)]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d4a853]">{m.id.slice(-6)}</td>
                  <td className="px-6 py-4">{m.chalet.name}</td>
                  <td className="px-6 py-4">{m.type}</td>
                  <td className="px-6 py-4 font-bold">{formatCur(m.cost)}</td>
                  <td className="px-6 py-4">{formatDate(m.date)}</td>
                  <td className="px-6 py-4">{m.completedDate ? formatDate(m.completedDate) : '—'}</td>
                  <td className="px-6 py-4">
                    {m.status === 'مكتملة' ? (
                      <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">مكتملة</span>
                    ) : (
                      <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">جارية</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {m.status === 'جارية' && (
                      <button className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-emerald-500 transition-colors" title="إنهاء الصيانة">
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {maintenances.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#8b92a5]">
                    <div className="text-4xl mb-4">🔧</div>
                    <h4 className="text-lg font-bold text-white mb-2">لا توجد طلبات صيانة</h4>
                    <p>الطلبات المسجلة ستظهر هنا</p>
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
