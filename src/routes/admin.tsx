import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGate } from "@/components/auth/AdminAuthGate";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "الثريا — لوحة التحكم" },
      { name: "description", content: "لوحة إدارة منصة الدعوات الإلكترونية" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRouteWithAuth,
});

function AdminRouteWithAuth() {
  return (
    <AdminAuthGate>
      <AdminLayout />
    </AdminAuthGate>
  );
}
