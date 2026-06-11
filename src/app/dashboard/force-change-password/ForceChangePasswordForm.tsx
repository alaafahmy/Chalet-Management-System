"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Save } from "lucide-react";
import { changeMyPassword } from "@/app/actions";

export default function ForceChangePasswordForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("كلمتي المرور غير متطابقتين");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("newPassword", newPassword);
    
    const result = await changeMyPassword(userId, formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      {error && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-lg text-sm border border-red-500/30 text-center font-bold">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[#8b92a5] text-sm mb-2 font-bold">كلمة المرور الجديدة</label>
        <div className="relative">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[var(--color-bg-input)] text-white p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a853] transition-all"
            required
            minLength={6}
          />
          <Lock className="absolute right-3 top-3 text-[#8b92a5]" size={20} />
        </div>
      </div>
      
      <div>
        <label className="block text-[#8b92a5] text-sm mb-2 font-bold">تأكيد كلمة المرور</label>
        <div className="relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[var(--color-bg-input)] text-white p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a853] transition-all"
            required
            minLength={6}
          />
          <Lock className="absolute right-3 top-3 text-[#8b92a5]" size={20} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#d4a853] text-[#06080d] p-3 rounded-lg font-bold hover:bg-[#b08b42] transition-colors mt-6 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-[#06080d] border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <Save size={20} /> حفظ كلمة المرور
          </>
        )}
      </button>
    </form>
  );
}
