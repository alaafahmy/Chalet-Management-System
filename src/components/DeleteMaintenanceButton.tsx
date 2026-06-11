"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteMaintenance } from "@/app/actions";

export default function DeleteMaintenanceButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    const res = await deleteMaintenance(id);
    setIsDeleting(false);
    if (res.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isDeleting}
        className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-red-500 transition-colors disabled:opacity-50"
        title="حذف"
      >
        <Trash2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 w-full max-w-sm relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-[#8b92a5] hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-[#8b92a5] text-sm leading-relaxed">
                هل أنت متأكد من رغبتك في حذف طلب الصيانة؟ سيتم أيضاً حذف سند الصرف المرتبط به إن وجد.
              </p>
            </div>

            {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-[var(--color-bg-input)] text-white p-3 rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white font-bold p-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
