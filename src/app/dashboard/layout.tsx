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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-[var(--color-bg-base)]">
          {children}
        </main>
      </div>
    </div>
  );
}
