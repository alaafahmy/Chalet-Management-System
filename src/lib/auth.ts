import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth(options?: { bypassPasswordCheck?: boolean }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    throw new Error("غير مصرح - يجب تسجيل الدخول");
  }

  let sessionData;
  try {
    sessionData = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf-8"));
  } catch (e) {
    throw new Error("غير مصرح - جلسة غير صالحة");
  }

  if (!sessionData || !sessionData.id) {
    throw new Error("غير مصرح - بيانات الجلسة غير صالحة");
  }

  if (sessionData.mustChangePassword && !options?.bypassPasswordCheck) {
    redirect("/dashboard/force-change-password");
  }

  return sessionData;
}

import { hasPermission, Permission } from "./permissions";

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.roleAr) && !allowedRoles.includes(user.role)) {
    throw new Error("غير مصرح - صلاحيات غير كافية");
  }
  
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireAuth();
  
  if (!hasPermission(user.role, permission)) {
    throw new Error("غير مصرح - لا تملك صلاحية الوصول لهذه الصفحة");
  }
  
  return user;
}
