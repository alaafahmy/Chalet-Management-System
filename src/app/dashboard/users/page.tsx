import { prisma } from "@/lib/prisma";
import { Plus, Shield, UserCog, UserX } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-purple-500/20 text-purple-500 p-2 rounded-lg"><UserCog size={24} /></span> إدارة المستخدمين والصلاحيات
        </h2>
        <button className="bg-gradient-to-r from-[#d4a853] to-[#b18532] text-[#06080d] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} /> إضافة مستخدم
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#d4a853] text-[#06080d]">
              <tr>
                <th className="px-6 py-4 font-bold">المعرف</th>
                <th className="px-6 py-4 font-bold">الاسم</th>
                <th className="px-6 py-4 font-bold">اسم المستخدم</th>
                <th className="px-6 py-4 font-bold">الصلاحية (الدور)</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[#f5f5f5]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[var(--color-bg-input)]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d4a853]">{u.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-bold">{u.name}</td>
                  <td className="px-6 py-4" dir="ltr">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-500/20 text-purple-500 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 flex items-center gap-1 w-fit">
                      <Shield size={12} /> {u.roleAr}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.active ? (
                      <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">نشط</span>
                    ) : (
                      <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">موقوف</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-[#d4a853] transition-colors" title="تعديل الصلاحيات">
                        <Shield size={16} />
                      </button>
                      <button className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-red-500 transition-colors" title={u.active ? "إيقاف" : "تفعيل"}>
                        <UserX size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
