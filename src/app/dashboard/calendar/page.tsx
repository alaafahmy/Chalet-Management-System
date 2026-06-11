import { prisma } from "@/lib/prisma";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

import { requirePermission } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CalendarPage({ searchParams }: Props) {
  await requirePermission("view_reservations");
  const chalets = await prisma.chalet.findMany();
  const reservations = await prisma.reservation.findMany({
    where: {
      status: { in: ['مؤكد', 'معلق'] }
    },
    include: { client: true }
  });

  const params = await searchParams;

  // Calculate dates for current month view
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  if (params?.year && !isNaN(Number(params.year))) {
    year = Number(params.year);
  }
  if (params?.month && !isNaN(Number(params.month))) {
    month = Number(params.month);
  }

  const currentDate = new Date(year, month, 1);
  year = currentDate.getFullYear();
  month = currentDate.getMonth();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      date: d,
      dayNum: i + 1,
      dayName: d.toLocaleDateString('ar-SA', { weekday: 'short' }),
      isToday: d.toDateString() === today.toDateString()
    };
  });

  const getReservationForDay = (chaletId: string, targetDate: Date) => {
    return reservations.find(r => {
      if (r.chaletId !== chaletId) return false;
      const start = new Date(r.checkIn);
      start.setHours(0,0,0,0);
      const end = new Date(r.checkOut);
      end.setHours(23,59,59,999);
      return targetDate >= start && targetDate <= end;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-purple-500/20 text-purple-500 p-2 rounded-lg"><CalendarIcon size={24} /></span> التقويم التفاعلي
        </h2>
        
        <div className="flex items-center gap-4 bg-[var(--color-bg-input)] rounded-lg p-1">
          <Link href={`/dashboard/calendar?month=${prevMonth}&year=${prevYear}`} className="p-2 hover:bg-[var(--color-bg-base)] rounded-md transition-colors text-white">
            <ChevronRight size={20} />
          </Link>
          <div className="font-bold text-white px-4">
            {currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
          </div>
          <Link href={`/dashboard/calendar?month=${nextMonth}&year=${nextYear}`} className="p-2 hover:bg-[var(--color-bg-base)] rounded-md transition-colors text-white">
            <ChevronLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="bg-[var(--color-bg-input)] text-white p-4 font-bold border border-[var(--color-border-subtle)] min-w-[150px] sticky right-0 z-10">
                  الشاليه
                </th>
                {days.map(d => (
                  <th key={d.dayNum} className={`p-2 border border-[var(--color-border-subtle)] min-w-[60px] ${d.isToday ? 'bg-[#d4a853]/20 text-[#d4a853]' : 'bg-[var(--color-bg-input)] text-[#cacedb]'}`}>
                    <div className="text-xs">{d.dayName}</div>
                    <div className="text-lg font-bold">{d.dayNum}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chalets.map(chalet => (
                <tr key={chalet.id}>
                  <td className="bg-[var(--color-bg-input)] text-white p-4 font-bold border border-[var(--color-border-subtle)] sticky right-0 z-10 text-right">
                    {chalet.name}
                  </td>
                  {days.map(d => {
                    const res = getReservationForDay(chalet.id, d.date);
                    let cellClass = "border border-[var(--color-border-subtle)] h-16 transition-colors hover:bg-[var(--color-bg-input)] cursor-pointer";
                    let content = null;

                    if (res) {
                      cellClass = res.status === 'مؤكد' 
                        ? "border border-[var(--color-border-subtle)] h-16 bg-blue-500/20 relative group cursor-pointer"
                        : "border border-[var(--color-border-subtle)] h-16 bg-orange-500/20 relative group cursor-pointer";
                        
                      content = (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-full h-4/5 mx-1 rounded-md flex items-center justify-center text-xs font-bold text-white px-1 overflow-hidden whitespace-nowrap ${res.status === 'مؤكد' ? 'bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-orange-500/80'}`}>
                            {res.client.name.split(' ')[0]}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <td key={`${chalet.id}-${d.dayNum}`} className={cellClass}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {chalets.length === 0 && (
                <tr>
                  <td colSpan={days.length + 1} className="py-12 text-[#8b92a5]">
                    لا توجد شاليهات لعرضها في التقويم.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-6 items-center pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/80"></div>
          <span className="text-sm text-[#cacedb]">محجوز (مؤكد)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/80"></div>
          <span className="text-sm text-[#cacedb]">بانتظار التأكيد (معلق)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-[var(--color-border-subtle)]"></div>
          <span className="text-sm text-[#cacedb]">متاح</span>
        </div>
      </div>
    </div>
  );
}
