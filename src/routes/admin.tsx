import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "الثريا — لوحة التحكم" },
      { name: "description", content: "لوحة إدارة منصة الدعوات الإلكترونية" },
    ],
  }),
  component: AdminLayout,
});
