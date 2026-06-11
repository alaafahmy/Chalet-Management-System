"use client";

import { useState } from "react";
import { FileText, X, Printer, Calendar, User, Home } from "lucide-react";

export default function PrintReceiptButton({ payment }: { payment: any }) {
  const [open, setOpen] = useState(false);

  const formatCur = (num: number) => new Intl.NumberFormat("ar-SA").format(num) + " ر.س";
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-blue-500 transition-colors"
        title="طباعة السند"
      >
        <FileText size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-blue-500/10">
              <div>
                <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <FileText size={24} /> سند قبض: <span className="text-white">{payment.ref_number}</span>
                </h2>
              </div>
              <div className="flex items-center gap-3 print:hidden">
                <button
                  onClick={() => {
                     const printContents = document.getElementById(`receipt-${payment.id}`)?.innerHTML;
                     const originalContents = document.body.innerHTML;
                     if(printContents) {
                        document.body.innerHTML = printContents;
                        window.print();
                        document.body.innerHTML = originalContents;
                        window.location.reload();
                     }
                  }}
                  className="bg-[#d4a853] text-[#06080d] px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Printer size={18} /> طباعة
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-[#8b92a5] hover:text-white bg-[var(--color-bg-input)] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 bg-white text-black rounded-b-lg print:m-0 print:p-0 print:shadow-none" id={`receipt-${payment.id}`}>
              <div className="text-center border-b-2 border-gray-200 pb-6">
                <h1 className="text-3xl font-bold mb-2">سند قبض</h1>
                <div className="text-gray-500 text-sm">Receipt Voucher</div>
              </div>

              <div className="flex justify-between items-start text-sm">
                <div className="space-y-2">
                  <div><span className="text-gray-500">رقم السند:</span> <strong className="text-lg">{payment.ref_number}</strong></div>
                  <div><span className="text-gray-500">التاريخ:</span> <strong>{formatDate(payment.date)}</strong></div>
                  <div><span className="text-gray-500">طريقة الدفع:</span> <strong>{payment.method}</strong></div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center min-w-[150px]">
                  <div className="text-gray-500 text-xs mb-1">المبلغ / Amount</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCur(payment.amount)}</div>
                </div>
              </div>

              <div className="space-y-4 border-t-2 border-gray-100 pt-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-gray-500">استلمنا من السيد/ة:</div>
                  <div className="col-span-9 font-bold border-b border-gray-300 pb-1">{payment.reservation.client.name}</div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-gray-500">مبلغ وقدره:</div>
                  <div className="col-span-9 font-bold border-b border-gray-300 pb-1">{formatCur(payment.amount)}</div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-gray-500">وذلك عن:</div>
                  <div className="col-span-9 font-bold border-b border-gray-300 pb-1 flex items-center gap-2">
                    دُفعة لحجز شاليه ({payment.reservation.chalet.name}) 
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">مرتبط بحجز: {payment.reservation.ref_number}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mt-12 text-center text-gray-500">
                <div>
                  <div className="mb-8">المستلم</div>
                  <div className="border-t border-gray-300 w-32 mx-auto pt-2 text-xs">التوقيع</div>
                </div>
                <div>
                  <div className="mb-8">الختم</div>
                  <div className="border-t border-gray-300 w-32 mx-auto pt-2 text-xs">المؤسسة</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
