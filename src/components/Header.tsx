"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  // Simple mapping for titles
  const titles: Record<string, string> = {
    "/dashboard": "لوحة التحكم",
    "/dashboard/calendar": "التقويم التفاعلي",
    "/dashboard/chalets": "إدارة الشاليهات",
    "/dashboard/clients": "إدارة العملاء",
    "/dashboard/reservations": "الحجوزات",
    "/dashboard/payments": "المدفوعات",
    "/dashboard/revenue": "الإيرادات",
    "/dashboard/expenses": "المصروفات",
    "/dashboard/profits": "الأرباح",
    "/dashboard/maintenance": "الصيانة",
    "/dashboard/users": "المستخدمين",
  };

  const title = titles[pathname] || "النظام";

  return (
    <header className="h-20 bg-[var(--color-bg-base)] border-b border-[var(--color-border-subtle)] px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        <div className="hidden md:flex items-center glass-input px-4 py-2 w-96 relative">
          <Search size={18} className="text-[#8b92a5] ml-3" />
          <input
            type="text"
            placeholder="بحث سريع... (اسم عميل، رقم حجز، شاليه)"
            className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder-[#8b92a5]"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:bg-[var(--color-bg-input)] p-2 rounded-full transition-colors">
          <Bell size={24} className="text-[#d4a853]" />
          <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--color-bg-base)]">
            3
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-sm font-bold text-white">المدير العام</div>
            <div className="text-xs text-[#8b92a5]">admin</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[#d4a853] to-[#b18532] rounded-full flex items-center justify-center font-bold text-[#06080d]">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
