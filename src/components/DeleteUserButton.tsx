"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/app/actions";

export default function DeleteUserButton({ id, username }: { id: string, username: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (username === 'admin') return null; // لا يمكن حذف المدير الأساسي من الواجهة

  async function handleDelete() {
    if (confirm("هل أنت متأكد من رغبتك في حذف المستخدم؟ إذا كانت لديه عمليات مالية، سيتم تعطيل حسابه فقط.")) {
      setIsDeleting(true);
      const res = await deleteUser(id);
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
      title="حذف المستخدم"
    >
      <Trash2 size={16} />
    </button>
  );
}
