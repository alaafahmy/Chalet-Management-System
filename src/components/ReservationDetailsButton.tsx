"use client";

import { useState } from "react";
import { Eye, X, Printer, Calendar, User, Home } from "lucide-react";

export default function ReservationDetailsButton({ reservation }: { reservation: any }) {
  const [open, setOpen] = useState(false);

  const formatCur = (num: number) => new Intl.NumberFormat("ar-SA").format(num) + " ر.س";
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  const paid = reservation.payments.reduce((s: number, p: any) => s + p.amount, 0);
  const remaining = reservation.totalCost - paid;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-[#d4a853] transition-colors"
        title="تفاصيل الحجز"
      >
        <Eye size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[#d4a853]/10">
              <div>
                <h2 className="text-2xl font-bold text-[#d4a853] flex items-center gap-2">
                  <Calendar size={24} /> تفاصيل الحجز: <span className="text-white">{reservation.ref_number}</span>
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-[#8b92a5] hover:text-white bg-[var(--color-bg-input)] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Reference IDs Section */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[var(--color-bg-input)]/50 p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <div className="text-[#8b92a5] text-xs mb-1 flex items-center gap-1"><Calendar size={12}/> رقم الحجز</div>
                  <div className="font-bold text-white text-lg">{reservation.ref_number}</div>
                </div>
                <div className="bg-[var(--color-bg-input)]/50 p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <div className="text-[#8b92a5] text-xs mb-1 flex items-center gap-1"><User size={12}/> رقم العميل</div>
                  <div className="font-bold text-white text-lg">{reservation.client.ref_number}</div>
                </div>
                <div className="bg-[var(--color-bg-input)]/50 p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <div className="text-[#8b92a5] text-xs mb-1 flex items-center gap-1"><Home size={12}/> رقم الشاليه</div>
                  <div className="font-bold text-white text-lg">{reservation.chalet.id}</div>
                </div>
              </div>

              {/* Data Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-[#d4a853] border-b border-[var(--color-border-subtle)] pb-2">بيانات العميل</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#8b92a5]">الاسم:</span> <span className="font-bold text-white">{reservation.client.name}</span></div>
                    <div className="flex justify-between"><span className="text-[#8b92a5]">الجوال:</span> <span className="text-white" dir="ltr">{reservation.client.phone}</span></div>
                    {reservation.client.nationalId && <div className="flex justify-between"><span className="text-[#8b92a5]">الهوية:</span> <span className="text-white">{reservation.client.nationalId}</span></div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-[#d4a853] border-b border-[var(--color-border-subtle)] pb-2">بيانات الإقامة</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#8b92a5]">الشاليه:</span> <span className="font-bold text-white">{reservation.chalet.name}</span></div>
                    <div className="flex justify-between"><span className="text-[#8b92a5]">تاريخ الدخول:</span> <span className="text-white">{formatDate(reservation.checkIn)}</span></div>
                    <div className="flex justify-between"><span className="text-[#8b92a5]">تاريخ الخروج:</span> <span className="text-white">{formatDate(reservation.checkOut)}</span></div>
                    <div className="flex justify-between"><span className="text-[#8b92a5]">عدد الليالي:</span> <span className="font-bold text-white">{reservation.nights} ليالي</span></div>
                  </div>
                </div>
              </div>

              {/* Financial Section */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-transparent p-4 rounded-lg border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 mb-4">الملخص المالي</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-[#8b92a5] mb-1">الإجمالي</div>
                    <div className="font-bold text-lg text-white">{formatCur(reservation.totalCost)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8b92a5] mb-1">المدفوع</div>
                    <div className="font-bold text-lg text-emerald-400">{formatCur(paid)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#8b92a5] mb-1">المتبقي</div>
                    <div className={`font-bold text-lg ${remaining > 0 ? "text-orange-400" : "text-emerald-400"}`}>{formatCur(remaining)}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border-subtle)] flex justify-end gap-3 bg-[var(--color-bg-input)]/30">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#d4a853] text-[#06080d] px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
              >
                <Printer size={18} /> طباعة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
