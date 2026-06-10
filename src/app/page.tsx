"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder for NextAuth login
    // For now, we will just route to dashboard
    if (username === "admin" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] bg-[#d4a853] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-[150px] h-[150px] bg-[#3b82f6] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#fbeea1] to-[#b18532] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#d4a853]/20">
            <span className="text-4xl">🏖️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">نظام إدارة الشاليهات</h1>
          <p className="text-[#8b92a5] text-sm tracking-wide">Chalet Management System</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-[#cacedb] mb-2">اسم المستخدم</label>
            <input
              type="text"
              className="glass-input w-full p-3"
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cacedb] mb-2">كلمة المرور</label>
            <input
              type="password"
              className="glass-input w-full p-3"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cacedb] mb-2">الدور الوظيفي</label>
            <select className="glass-input w-full p-3 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cacedb%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[position:left_1rem_center]">
              <option value="admin">مدير عام (System Administrator)</option>
              <option value="reservation_manager">مدير حجوزات (Reservation Manager)</option>
              <option value="accountant">محاسب (Accountant)</option>
              <option value="receptionist">موظف استقبال (Receptionist)</option>
              <option value="maintenance">مشرف صيانة (Maintenance Supervisor)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#d4a853] to-[#b18532] hover:from-[#fbeea1] hover:to-[#d4a853] text-[#06080d] font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#d4a853]/20"
          >
            تسجيل الدخول
          </button>

          <p className="text-center text-[#8b92a5] text-xs mt-4">
            للتجربة: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
