"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { formatRefID } from "@/lib/utils";
import EditClientForm from "./EditClientForm";
import DeleteClientButton from "./DeleteClientButton";

type Client = {
  id: string;
  name: string;
  phone: string;
  nationalId: string | null;
  notes: string | null;
  _count: { reservations: number };
};

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filteredClients = initialClients.filter(c => 
    c.name.includes(search) || 
    c.phone.includes(search) || 
    (c.nationalId && c.nationalId.includes(search))
  );

  return (
    <>
      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b92a5]" />
          <input
            type="text"
            placeholder="بحث عن عميل بالاسم، الجوال، أو الهوية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full py-2 pr-10 pl-4 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#d4a853] text-[#06080d]">
              <tr>
                <th className="px-6 py-4 font-bold">الرقم</th>
                <th className="px-6 py-4 font-bold">الاسم</th>
                <th className="px-6 py-4 font-bold">رقم الجوال</th>
                <th className="px-6 py-4 font-bold">الهوية</th>
                <th className="px-6 py-4 font-bold">الحجوزات</th>
                <th className="px-6 py-4 font-bold">ملاحظات</th>
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[#f5f5f5]">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-bg-input)]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d4a853]">{formatRefID(c.id, 'CLI')}</td>
                  <td className="px-6 py-4 font-bold">{c.name}</td>
                  <td className="px-6 py-4" dir="ltr">{c.phone}</td>
                  <td className="px-6 py-4">{c.nationalId || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full font-bold">
                      {c._count.reservations}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[150px] truncate text-[#8b92a5]">{c.notes || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <EditClientForm client={c} />
                      <DeleteClientButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#8b92a5]">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-lg font-bold text-white mb-2">لا يوجد عملاء</h4>
                    <p>لم يتم العثور على أي عميل يطابق بحثك</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
