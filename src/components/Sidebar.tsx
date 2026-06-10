"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Home,
  Users,
  ClipboardList,
  CreditCard,
  TrendingUp,
  TrendingDown,
  LineChart,
  Wrench,
  UserCog,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    { name: "التقويم التفاعلي", href: "/dashboard/calendar", icon: Calendar },
    { name: "إدارة الشاليهات", href: "/dashboard/chalets", icon: Home },
    { name: "إدارة العملاء", href: "/dashboard/clients", icon: Users },
    { name: "الحجوزات", href: "/dashboard/reservations", icon: ClipboardList },
    { name: "المدفوعات", href: "/dashboard/payments", icon: CreditCard },
    { name: "الإيرادات", href: "/dashboard/revenue", icon: TrendingUp },
    { name: "المصروفات", href: "/dashboard/expenses", icon: TrendingDown },
    { name: "الأرباح", href: "/dashboard/profits", icon: LineChart },
    { name: "الصيانة", href: "/dashboard/maintenance", icon: Wrench },
    { name: "المستخدمين", href: "/dashboard/users", icon: UserCog },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#d4a853] to-[#b18532] text-[#06080d] p-4 rounded-full shadow-[0_0_20px_rgba(212,168,83,0.4)]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed md:relative top-0 right-0 h-screen bg-[var(--color-bg-panel)] border-l border-[var(--color-border-subtle)] w-64 flex flex-col z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"} overflow-y-auto`}>
        {/* Brand */}
      <div className="p-6 flex items-center justify-center border-b border-[var(--color-border-subtle)] gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#fbeea1] to-[#b18532] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4a853]/20">
          <span className="text-xl">🏖️</span>
        </div>
        <div>
          <h1 className="font-bold text-white text-lg">إدارة الشاليهات</h1>
          <p className="text-[10px] text-[#8b92a5]">Alaa & Ayman Team</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-bg-input)] text-[var(--color-gold-primary)] font-bold border-r-2 border-[var(--color-gold-primary)]"
                  : "text-[#cacedb] hover:bg-[var(--color-bg-input)]/50 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[var(--color-gold-primary)]" : "text-[#8b92a5]"} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--color-border-subtle)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
