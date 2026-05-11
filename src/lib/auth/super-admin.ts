/**
 * صلاحية لوحة الإدارة لا تُشتق من عمود `role` في قاعدة البيانات وحدها؛
 * فقط هذا البريد يُعامل كمشرف في الواجهة والـ API العامة للمستخدم.
 */
export const SUPER_ADMIN_EMAIL = "r.s.althobaiti@gmail.com";

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** الدور الظاهر للعميل والتحقق من الوصول إلى `/admin`. */
export function effectivePublicRole(email: string): "user" | "admin" {
  return normalizeAuthEmail(email) === normalizeAuthEmail(SUPER_ADMIN_EMAIL)
    ? "admin"
    : "user";
}
