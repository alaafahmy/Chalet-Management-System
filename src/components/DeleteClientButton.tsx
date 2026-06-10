"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteClient } from "@/app/actions";

export default function DeleteClientButton({ id, name }: { id: string, name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm(`هل أنت متأكد من رغبتك في حذف العميل "${name}"؟`)) {
      setIsDeleting(true);
      const res = await deleteClient(id);
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
      title="حذف العميل"
    >
      <Trash2 size={16} />
    </button>
  );
}
