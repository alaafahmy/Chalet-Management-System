import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth({ bypassPasswordCheck: true });

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)]">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header userName={user.name} userRole={user.roleAr} />
        <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-bg-base)]">
          <div className="pb-12">
            {children}
          </div>
        </main>
        {/* Footer */}
        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <span className="text-[10px] text-white/30 tracking-widest uppercase">صنع بواسطة Alaa Soft</span>
        </div>
      </div>
    </div>
  );
}
