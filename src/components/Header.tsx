"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut, User, X, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({
  userName = "مستخدم",
  userRole = "user",
  onMenuToggle,
  isSidebarOpen = false,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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
    "/dashboard/profits": "الأرباح",
    "/dashboard/reports": "التقارير",
    "/dashboard/maintenance": "الصيانة",
    "/dashboard/users": "المستخدمين",
  };

  const title = titles[pathname] || "النظام";

  // Fetch notifications + trigger daily checks
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

    async function runDailyChecks() {
      // تشغيل الفحص اليومي مرة واحدة في اليوم (مخزَّن في localStorage)
      const lastCheck = localStorage.getItem("lastDailyCheck");
      const today = new Date().toDateString();
      if (lastCheck !== today) {
        try {
          await fetch('/api/cron/daily-checks');
          localStorage.setItem("lastDailyCheck", today);
        } catch (e) {
          console.error("Daily check failed");
        }
      }
    }

    fetchNotifs();
    runDailyChecks();
    const interval = setInterval(fetchNotifs, 30000); // فحص كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false);
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
      <header className="h-16 md:h-20 bg-[var(--color-ui-bg-panel)] backdrop-blur-md border-b border-[var(--color-ui-border-subtle)] px-3 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm gap-2">

        {/* Right Section: Title + Desktop Search */}
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">

          {/* Page Title */}
          <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide animate-fade-in whitespace-nowrap">{title}</h2>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center glass-input px-4 py-2.5 w-80 lg:w-96 relative group transition-all duration-300 focus-within:w-[28rem]" ref={searchRef}>
            <Search size={18} className="text-[var(--color-ui-text-muted)] ml-3 group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
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
              className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder-[var(--color-ui-text-muted)]"
            />

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 glass-panel overflow-y-auto max-h-96 z-50 animate-scale-up origin-top">
                {isSearching ? (
                  <div className="p-6 text-center text-[var(--color-ui-text-muted)] text-sm flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    جاري البحث...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.link}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block px-4 py-3 hover:bg-[var(--color-ui-bg-panel-hover)] border-b border-[var(--color-ui-border-subtle)] last:border-0 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-[var(--color-brand-primary)] text-sm">{item.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-ui-bg-base)] text-[var(--color-ui-text-muted)] border border-[var(--color-ui-border-subtle)]">{item.type}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-[var(--color-ui-text-muted)]">
                          <span>{item.subtitle}</span>
                          {item.ref && <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">{item.ref}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-[var(--color-ui-text-muted)] text-sm">لا توجد نتائج مطابقة</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Left Section: Actions */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">

          {/* Mobile Search Button */}
          <div className="md:hidden relative" ref={mobileSearchRef}>
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-ui-bg-input)] hover:bg-[var(--color-ui-bg-panel-hover)] transition-all duration-300"
              aria-label="بحث"
            >
              <Search size={17} className="text-[var(--color-ui-text-secondary)]" />
            </button>

            {/* Mobile Search Dropdown */}
            {showMobileSearch && (
              <div className="absolute top-full left-0 mt-2 w-screen max-w-[calc(100vw-1.5rem)] -translate-x-full z-50 animate-scale-up origin-top-left" style={{ right: 'auto', left: 0 }}>
                <div className="glass-panel p-3 mx-auto" style={{ width: 'min(340px, calc(100vw - 1.5rem))' }}>
                  <div className="flex items-center glass-input px-3 py-2">
                    <Search size={16} className="text-[var(--color-ui-text-muted)] ml-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          setShowMobileSearch(false);
                          setShowSearchDropdown(false);
                          router.push(`/dashboard/clients?search=${encodeURIComponent(searchQuery.trim())}`);
                        }
                      }}
                      placeholder="بحث..."
                      className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder-[var(--color-ui-text-muted)]"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {searchResults.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.link}
                          onClick={() => { setShowMobileSearch(false); setShowSearchDropdown(false); }}
                          className="block px-3 py-2.5 hover:bg-[var(--color-ui-bg-panel-hover)] border-b border-[var(--color-ui-border-subtle)] last:border-0 transition-colors rounded-lg"
                        >
                          <div className="font-bold text-[var(--color-brand-primary)] text-sm">{item.title}</div>
                          <div className="text-xs text-[var(--color-ui-text-muted)]">{item.subtitle}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-[var(--color-ui-bg-input)] hover:bg-[var(--color-ui-bg-panel-hover)] transition-all duration-300 relative group"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              aria-label="الإشعارات"
            >
              <Bell size={18} className="text-[var(--color-brand-primary)] group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-[var(--color-ui-bg-panel)] shadow-sm animate-pulse px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full mt-2 glass-panel overflow-y-auto max-h-80 z-50 animate-scale-up origin-top-left"
                style={{ width: 'min(320px, calc(100vw - 2rem))', left: 'auto', right: 0 }}>
                <div className="p-3 border-b border-[var(--color-ui-border-subtle)] font-bold text-white flex justify-between items-center bg-[var(--color-ui-bg-panel-hover)]">
                  <span className="text-sm">الإشعارات</span>
                  <button onClick={() => setShowNotifications(false)} className="text-[var(--color-ui-text-muted)] hover:text-white transition-colors bg-white/5 p-1 rounded-md">
                    <X size={14} />
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <div className="py-2">
                    {notifications.map((n, idx) => (
                      <div key={idx} className={`px-4 py-3 border-b border-[var(--color-ui-border-subtle)] last:border-0 transition-colors hover:bg-[var(--color-ui-bg-panel-hover)] ${!n.read ? 'bg-[var(--color-brand-glow)]/10' : ''}`}>
                        <div className="text-sm font-bold text-[var(--color-brand-primary)] mb-1 flex items-center gap-2">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] inline-block"></span>}
                          {n.title}
                        </div>
                        <div className="text-xs text-[var(--color-ui-text-secondary)] mb-2 leading-relaxed">{n.description}</div>
                        <div className="text-[10px] text-[var(--color-ui-text-muted)] font-mono">
                          {new Date(n.date).toLocaleString('ar-SA')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[var(--color-ui-text-muted)] text-sm flex flex-col items-center gap-2">
                    <Bell size={24} className="opacity-20" />
                    لا توجد إشعارات جديدة
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info - Desktop only */}
          <div className="hidden md:flex items-center gap-3 pr-4 border-r border-[var(--color-ui-border-subtle)]">
            <div className="text-left">
              <div className="text-sm font-bold text-white">{userName}</div>
              <div className="text-xs text-[var(--color-brand-primary)] uppercase tracking-wider">{userRole}</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-brand-dark)] rounded-xl flex items-center justify-center font-bold text-[var(--color-ui-bg-base)] shadow-[0_2px_10px_var(--color-brand-glow)]">
              <User size={18} />
            </div>
          </div>

          {/* Logout button - Desktop only */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="hidden md:flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-bold group"
            title="تسجيل الخروج"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>خروج</span>
          </button>

          {/* Mobile User Avatar */}
          <div
            className="md:hidden w-9 h-9 bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-brand-dark)] rounded-xl flex items-center justify-center font-bold text-[var(--color-ui-bg-base)] shadow-[0_2px_10px_var(--color-brand-glow)] cursor-pointer"
            onClick={() => setShowLogoutConfirm(true)}
            title="تسجيل الخروج"
          >
            <User size={16} />
          </div>

          {/* Menu Toggle Button - Mobile only (in header) */}
          <button
            onClick={onMenuToggle}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] shadow-[0_2px_8px_var(--color-brand-glow)] hover:scale-105 transition-transform"
            aria-label="فتح القائمة"
          >
            {isSidebarOpen ? (
              <X size={18} className="text-[var(--color-ui-bg-base)]" />
            ) : (
              <Menu size={18} className="text-[var(--color-ui-bg-base)]" />
            )}
          </button>
        </div>
      </header>

      {/* حوار تأكيد تسجيل الخروج */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel p-8 w-full max-w-sm animate-scale-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">👋</div>
              <h3 className="text-xl font-bold text-white mb-2">تسجيل الخروج</h3>
              <p className="text-[var(--color-ui-text-muted)] text-sm leading-relaxed">هل أنت متأكد من تسجيل الخروج؟ سيتم إنهاء جلستك الحالية.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-[var(--color-ui-bg-input)] text-white p-3 rounded-xl hover:bg-[var(--color-ui-bg-panel-hover)] border border-[var(--color-ui-border-subtle)] transition-all duration-300 font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold p-3 rounded-xl shadow-[0_4px_12px_rgba(220,38,38,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
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
                    <LogOut size={16} /> تأكيد الخروج
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
