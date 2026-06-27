import DashboardShell from "@/components/DashboardShell";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth({ bypassPasswordCheck: true });

  return (
    <DashboardShell
      userName={user.name}
      userRoleAr={user.roleAr}
      userRole={user.role}
    >
      {children}
    </DashboardShell>
  );
}
