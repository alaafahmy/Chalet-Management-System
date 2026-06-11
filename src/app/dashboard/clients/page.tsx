import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import AddClientForm from "@/components/AddClientForm";
import ClientList from "@/components/ClientList";

export const dynamic = 'force-dynamic';

import { requirePermission } from "@/lib/auth";

export default async function ClientsPage() {
  await requirePermission("view_clients");
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: { reservations: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-blue-500/20 text-blue-500 p-2 rounded-lg"><Users size={24} /></span> سجل العملاء
        </h2>
        <AddClientForm />
      </div>

      <ClientList initialClients={clients} />
    </div>
  );
}
