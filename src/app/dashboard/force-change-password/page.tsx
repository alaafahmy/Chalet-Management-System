import { requireAuth } from "@/lib/auth";
import ForceChangePasswordForm from "./ForceChangePasswordForm";

export const dynamic = 'force-dynamic';

export default async function ForceChangePasswordPage() {
  const user = await requireAuth({ bypassPasswordCheck: true });

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="glass-panel p-8 max-w-md w-full space-y-6 relative overflow-hidden">
        {/* Highlight accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-[#d4a853]"></div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تحديث كلمة المرور مطلوب</h2>
          <p className="text-[#8b92a5] text-sm">
            مرحباً {user.name}، لأسباب أمنية يرجى تغيير كلمة المرور الخاصة بك للتمكن من الوصول للنظام.
          </p>
        </div>

        <ForceChangePasswordForm userId={user.id} />
      </div>
    </div>
  );
}
