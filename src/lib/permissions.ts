export type Role =
  | 'admin'
  | 'reservation_manager'
  | 'accountant'
  | 'receptionist'
  | 'maintenance';

export type Permission =
  | 'manage_chalets'
  | 'view_chalets'
  | 'manage_clients'
  | 'view_clients'
  | 'manage_reservations'
  | 'view_reservations'
  | 'manage_payments'
  | 'create_payments'
  | 'view_payments'
  | 'view_financial_reports'
  | 'manage_expenses'
  | 'view_profit_analysis'
  | 'manage_maintenance'
  | 'view_maintenance'
  | 'manage_users'
  | 'export_reports';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'manage_chalets', 'view_chalets',
    'manage_clients', 'view_clients',
    'manage_reservations', 'view_reservations',
    'manage_payments', 'create_payments', 'view_payments',
    'view_financial_reports',
    'manage_expenses',
    'view_profit_analysis',
    'manage_maintenance', 'view_maintenance',
    'manage_users',
    'export_reports'
  ],
  reservation_manager: [
    'manage_chalets', 'view_chalets',
    'manage_clients', 'view_clients',
    'manage_reservations', 'view_reservations',
    'manage_payments', 'create_payments', 'view_payments',
    'view_financial_reports',
    'manage_expenses',
    'view_maintenance', // عرض فقط
    'export_reports'
  ],
  accountant: [
    'manage_payments', 'create_payments', 'view_payments',
    'view_financial_reports',
    'manage_expenses',
    'view_profit_analysis',
    'view_maintenance', // عرض فقط
    'export_reports'
  ],
  receptionist: [
    'view_chalets', // عرض فقط
    'manage_clients', 'view_clients',
    'manage_reservations', 'view_reservations',
    'create_payments', 'view_payments', // تسجيل وعرض فقط
  ],
  maintenance: [
    'manage_maintenance', 'view_maintenance'
  ]
};

export function hasPermission(role: string, permission: Permission): boolean {
  const userRole = role as Role;
  if (!ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

// Arabic role mappings for fallback or matching
export const ROLE_MAPPING: Record<string, Role> = {
  'مدير عام': 'admin',
  'مدير حجوزات': 'reservation_manager',
  'محاسب': 'accountant',
  'استقبال': 'receptionist',
  'صيانة': 'maintenance'
};

export function getRoleFromArabic(roleAr: string): Role | undefined {
  return ROLE_MAPPING[roleAr];
}
