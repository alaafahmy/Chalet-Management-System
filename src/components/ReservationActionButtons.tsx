"use client";

import { useState } from "react";
import { CheckCircle, XCircle, LogOut, X, AlertTriangle } from "lucide-react";
import { updateReservationStatus, cancelAndRefundReservation } from "@/app/actions";

type Action = "confirm" | "checkout" | "cancel";

interface ReservationActionButtonsProps {
  id: string;
  status: string;
  totalCost: number;
  paid: number;
}

export default function ReservationActionButtons({ id, status, totalCost, paid }: ReservationActionButtonsProps) {
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remaining = totalCost - paid;
  const isFullyPaid = remaining <= 0.01;

  const [refundType, setRefundType] = useState<"none" | "full" | "partial">("none");
  const [refundAmount, setRefundAmount] = useState<string>("");

  async function handleAction(action: Action) {
    setPendingAction(action);
    setError(null);

    let res;
    if (action === "cancel") {
      let amount = 0;
      if (refundType === "full") amount = paid;
      if (refundType === "partial") amount = Number(refundAmount);
      
      if (refundType === "partial" && (amount <= 0 || amount > paid)) {
        setError(`مبلغ الاسترجاع يجب أن يكون أكبر من صفر وألا يتجاوز ${formatCur(paid)}`);
        setPendingAction(null);
        return;
      }
      
      res = await cancelAndRefundReservation(id, amount);
    } else {
      const statusMap: Record<Action, string> = {
        confirm: "مؤكد",
        checkout: "مكتمل",
        cancel: "ملغي",
      };
      res = await updateReservationStatus(id, statusMap[action]);
    }

    setPendingAction(null);

    if (res && "error" in res && res.error) {
      setError(res.error);
    } else {
      setConfirmAction(null);
      setRefundType("none");
      setRefundAmount("");
    }
  }

  const actionLabels: Record<Action, string> = {
    confirm: "تأكيد الحجز",
    checkout: "تسجيل الخروج",
    cancel: "إلغاء الحجز",
  };

  const actionColors: Record<Action, string> = {
    confirm: "bg-emerald-600 hover:bg-emerald-700",
    checkout: "bg-blue-600 hover:bg-blue-700",
    cancel: "bg-red-600 hover:bg-red-700",
  };

  const formatCur = (num: number) => new Intl.NumberFormat("ar-SA").format(num) + " ر.س";

  return (
    <>
      <div className="flex gap-2">
        {status === "معلق" && (
          <button
            onClick={() => { setError(null); setConfirmAction("confirm"); }}
            disabled={!!pendingAction}
            className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-emerald-500 transition-colors disabled:opacity-50"
            title="تأكيد الحجز"
          >
            <CheckCircle size={16} />
          </button>
        )}
        {status === "مؤكد" && (
          <button
            onClick={() => { setError(null); setConfirmAction("checkout"); }}
            disabled={!!pendingAction}
            className={`p-2 bg-[var(--color-bg-input)] rounded-md transition-colors disabled:opacity-50 ${
              !isFullyPaid ? "text-orange-400 hover:text-orange-300" : "text-[#cacedb] hover:text-blue-500"
            }`}
            title={!isFullyPaid ? `تسجيل خروج — متبقي: ${formatCur(remaining)}` : "تسجيل خروج"}
          >
            <LogOut size={16} />
          </button>
        )}
        {status !== "مكتمل" && status !== "ملغي" && (
          <button
            onClick={() => { setError(null); setConfirmAction("cancel"); }}
            disabled={!!pendingAction}
            className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-red-500 transition-colors disabled:opacity-50"
            title="إلغاء الحجز"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 w-full max-w-sm relative">
            <button
              onClick={() => { setConfirmAction(null); setError(null); }}
              className="absolute top-4 left-4 text-[#8b92a5] hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-4">
                {confirmAction === "confirm" ? "✅" : confirmAction === "checkout" ? "🏁" : "❌"}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{actionLabels[confirmAction]}</h3>

              {/* تحذير خاص بتسجيل الخروج مع مبلغ متبقي */}
              {confirmAction === "checkout" && !isFullyPaid && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mt-3 text-sm text-right">
                  <div className="flex items-center gap-2 text-orange-400 font-bold mb-1">
                    <AlertTriangle size={16} />
                    <span>تحذير: يوجد مبلغ متبقي غير مدفوع</span>
                  </div>
                  <div className="text-[#8b92a5] space-y-1">
                    <div className="flex justify-between">
                      <span>إجمالي الحجز:</span>
                      <span className="text-white font-bold">{formatCur(totalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المدفوع:</span>
                      <span className="text-emerald-400 font-bold">{formatCur(paid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المتبقي:</span>
                      <span className="text-red-400 font-bold">{formatCur(remaining)}</span>
                    </div>
                  </div>
                  <p className="text-orange-400 text-xs mt-2">لا يمكن تسجيل الخروج إلا بعد سداد كامل المبلغ.</p>
                </div>
              )}

              {confirmAction === "cancel" && (
                <div className="text-right">
                  <p className="text-[#8b92a5] text-sm mt-2 mb-4">هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.</p>
                  
                  {paid > 0 && (
                    <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm mb-2 border-b border-[var(--color-border-subtle)] pb-2">
                        <span className="text-[#8b92a5]">المبلغ المدفوع:</span>
                        <span className="font-bold text-emerald-400">{formatCur(paid)}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 text-sm text-white cursor-pointer hover:bg-[var(--color-bg-input)] p-2 rounded-md transition-colors">
                          <input type="radio" name="refund" checked={refundType === "none"} onChange={() => setRefundType("none")} className="accent-[#d4a853] w-4 h-4" />
                          <span>لا يوجد استرجاع (الاحتفاظ بالمبلغ كرسوم إلغاء)</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-white cursor-pointer hover:bg-[var(--color-bg-input)] p-2 rounded-md transition-colors">
                          <input type="radio" name="refund" checked={refundType === "full"} onChange={() => setRefundType("full")} className="accent-[#d4a853] w-4 h-4" />
                          <span>استرجاع كامل المبلغ ({formatCur(paid)})</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-white cursor-pointer hover:bg-[var(--color-bg-input)] p-2 rounded-md transition-colors">
                          <input type="radio" name="refund" checked={refundType === "partial"} onChange={() => setRefundType("partial")} className="accent-[#d4a853] w-4 h-4" />
                          <span>استرجاع مبلغ مخصص (جزئي)</span>
                        </label>
                      </div>

                      {refundType === "partial" && (
                        <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                          <input 
                            type="number" 
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] rounded-md p-3 text-white focus:border-[#d4a853] outline-none"
                            placeholder={`المبلغ المراد استرجاعه (أقصى حد ${paid})`}
                            max={paid}
                            min={1}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {confirmAction === "confirm" && (
                <p className="text-[#8b92a5] text-sm mt-2">سيتم تأكيد الحجز وتحديث حالة الشاليه إلى "محجوز".</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/30">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmAction(null); setError(null); }}
                className="flex-1 bg-[var(--color-bg-input)] text-white p-3 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleAction(confirmAction)}
                disabled={!!pendingAction || (confirmAction === "checkout" && !isFullyPaid)}
                className={`flex-1 ${actionColors[confirmAction]} text-white font-bold p-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {pendingAction ? "جاري التحديث..." : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
