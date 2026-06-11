"use client";

import { useState } from "react";
import { KeyRound, X, Check } from "lucide-react";
import { resetUserPassword } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ResetUserPasswordButton({ id, username }: { id: string, username: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("newPassword", newPassword);
    
    const result = await resetUserPassword(id, formData);
    
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      setNewPassword("");
      router.refresh();
      alert(`تم إعادة تعيين كلمة المرور بنجاح للمستخدم ${username}. سيُطلب منه تغييرها عند الدخول القادم.`);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white p-2 rounded-lg transition-colors border border-blue-500/30"
        title="إعادة تعيين كلمة المرور"
      >
        <KeyRound size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-[#8b92a5] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6 pr-8 text-right flex items-center gap-2">
              <KeyRound className="text-blue-500" />
              إعادة تعيين كلمة مرور <span className="text-blue-500" dir="ltr">{username}</span>
            </h3>

            {error && (
              <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-500/30 text-right">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4 text-right">
              <div>
                <label className="block text-[#8b92a5] text-sm mb-2 font-bold">كلمة المرور المؤقتة</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[var(--color-bg-input)] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                  dir="ltr"
                  placeholder="أدخل كلمة مرور مؤقتة (مثال: 123456)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-[#8b92a5] mt-2 leading-relaxed">
                  هذه كلمة المرور ستكون مؤقتة، وسيجبر النظام المستخدم على تغييرها فور تسجيل دخوله الناجح.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check size={20} /> تعيين كلمة المرور
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 bg-[var(--color-bg-input)] text-white rounded-lg hover:bg-[var(--color-border-subtle)] transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
