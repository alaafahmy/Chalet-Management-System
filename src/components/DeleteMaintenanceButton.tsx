"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteMaintenance } from "@/app/actions";

export default function DeleteMaintenanceButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("هل أنت متأكد من رغبتك في حذف طلب الصيانة؟ سيتم أيضاً حذف سند الصرف المرتبط به إن وجد.")) {
      setIsDeleting(true);
      const res = await deleteMaintenance(id);
      setIsDeleting(false);
      if (res.error) {
        alert(res.error);
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-[var(--color-bg-input)] rounded-md text-[#cacedb] hover:text-red-500 transition-colors disabled:opacity-50"
      title="حذف طلب الصيانة"
    >
      <Trash2 size={16} />
    </button>
  );
}
