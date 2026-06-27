"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userRoleAr: string;
  userRole: string;
}

export default function DashboardShell({ children, userName, userRoleAr, userRole }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)]">
      <Sidebar
        userRole={userRole}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          userName={userName}
          userRole={userRoleAr}
          onMenuToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg-base)] flex flex-col">
          <div className="flex-1 p-4 md:p-8 pb-4">
            {children}
          </div>
          {/* Footer */}
          <div className="shrink-0 text-center pb-4 pointer-events-none">
            <span className="text-[10px] text-white/30 tracking-widest uppercase">صنع بواسطة Alaa Soft</span>
          </div>
        </main>
      </div>
    </div>
  );
}
