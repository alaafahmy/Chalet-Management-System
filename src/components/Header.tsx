"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Header({ userName = "مستخدم", userRole = "user" }: { userName?: string, userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const titles: Record<string, string> = {
    "/dashboard": "لوحة التحكم",
    "/dashboard/calendar": "التقويم التفاعلي",
    "/dashboard/chalets": "إدارة الشاليهات",
    "/dashboard/clients": "إدارة العملاء",
    "/dashboard/reservations": "الحجوزات",
    "/dashboard/payments": "المدفوعات",
    "/dashboard/revenue": "الإيرادات",
    "/dashboard/expenses": "المصروفات",
    "/dashboard/profits": "التقارير المالية",
    "/dashboard/maintenance": "الصيانة",
    "/dashboard/users": "المستخدمين",
  };

  const title = titles[pathname] || "النظام";

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (e) {
        console.error("Failed to fetch notifications");
      }
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Input
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowSearchDropdown(true);
        } catch (e) {
          console.error("Search failed");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // حتى لو فشل الطلب، نحذف الجلسة محلياً
    }
    router.replace("/");
  }

  async function markNotificationsAsRead() {
    if (unreadCount === 0) return;
    try {
      await fetch('/api/notifications', { method: 'POST', body: JSON.stringify({}) });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark as read");
    }
  }

  return (
    <>
      <header className="h-20 bg-[var(--color-bg-base)] border-b border-[var(--color-border-subtle)] px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-2xl font-bold text-white">{title}</h2>

          <div className="hidden md:flex items-center glass-input px-4 py-2 w-96 relative" ref={searchRef}>
            <Search size={18} className="text-[#8b92a5] ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowSearchDropdown(false);
                  router.push(`/dashboard/clients?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder="بحث سريع... (اسم عميل، رقم حجز، شاليه)"
              className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder-[#8b92a5]"
            />

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#06080d] border border-[var(--color-border-subtle)] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-[#8b92a5] text-sm">جاري البحث...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((item, idx) => (
                      <Link 
                        key={idx} 
                        href={item.link}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block px-4 py-3 hover:bg-[var(--color-bg-input)] border-b border-[var(--color-border-subtle)] last:border-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-[#d4a853] text-sm">{item.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-base)] text-[#8b92a5]">{item.type}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-[#8b92a5]">
                          <span>{item.subtitle}</span>
                          {item.ref && <span className="font-mono text-[10px] bg-white/5 px-1 rounded">{item.ref}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#8b92a5] text-sm">لا توجد نتائج مطابقة</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* الإشعارات */}
          <div className="relative" ref={notifRef}>
            <div 
              className="cursor-pointer hover:bg-[var(--color-bg-input)] p-2 rounded-full transition-colors relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
            >
              <Bell size={24} className="text-[#d4a853]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--color-bg-base)]">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#06080d] border border-[var(--color-border-subtle)] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                <div className="p-3 border-b border-[var(--color-border-subtle)] font-bold text-white flex justify-between items-center">
                  <span>الإشعارات</span>
                  <button onClick={() => setShowNotifications(false)} className="text-[#8b92a5] hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <div className="py-2">
                    {notifications.map((n, idx) => (
                      <div key={idx} className={`px-4 py-3 border-b border-[var(--color-border-subtle)] last:border-0 ${!n.read ? 'bg-white/5' : ''}`}>
                        <div className="text-sm font-bold text-[#d4a853] mb-1">{n.title}</div>
                        <div className="text-xs text-white mb-2">{n.description}</div>
                        <div className="text-[10px] text-[#8b92a5]">
                          {new Date(n.date).toLocaleString('ar-SA')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#8b92a5] text-sm">لا توجد إشعارات جديدة</div>
                )}
              </div>
            )}
          </div>

          {/* معلومات المستخدم */}
          <div className="flex items-center gap-3 pr-4 border-r border-[var(--color-border-subtle)]">
            <div className="text-left">
              <div className="text-sm font-bold text-white">{userName}</div>
              <div className="text-xs text-[#8b92a5]">{userRole}</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4a853] to-[#b18532] rounded-full flex items-center justify-center font-bold text-[#06080d]">
              <User size={18} />
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all text-sm font-bold"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* حوار تأكيد تسجيل الخروج */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👋</div>
              <h3 className="text-xl font-bold text-white mb-2">تسجيل الخروج</h3>
              <p className="text-[#8b92a5] text-sm">هل أنت متأكد من تسجيل الخروج؟ سيتم إنهاء جلستك الحالية.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-[var(--color-bg-input)] text-white p-3 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    جاري الخروج...
                  </>
                ) : (
                  <>
                    <LogOut size={16} /> تسجيل الخروج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
