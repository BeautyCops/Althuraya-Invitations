import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminSection =
  | "overview"
  | "invitations"
  | "users"
  | "events"
  | "payments"
  | "analytics"
  | "templates"
  | "notifications"
  | "settings";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "invitations", label: "الدعوات", icon: Mail },
  { id: "users", label: "المستخدمون", icon: Users },
  { id: "events", label: "المناسبات", icon: Calendar },
  { id: "payments", label: "المدفوعات", icon: CreditCard },
  { id: "analytics", label: "التحليلات", icon: BarChart3 },
  { id: "templates", label: "القوالب", icon: LayoutTemplate },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

type AdminSidebarProps = {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  className?: string;
};

export function AdminSidebar({
  active,
  onChange,
  className,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-64 flex-col border-th-lavender/10 bg-th-deep/55 backdrop-blur-xl lg:border-e",
        className,
      )}
    >
      <div className="border-b border-th-lavender/10 px-5 py-6">
        <p className="text-gradient font-bold text-lg leading-tight">
          لوحة التحكم
        </p>
        <p className="mt-1 text-xs text-th-lavender/70">الثريا للدعوات</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onChange(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-th-royal/35 text-th-cream shadow-soft"
                      : "text-th-lavender/80 hover:bg-th-deep/80 hover:text-th-cream",
                  )}
                >
                  <Icon className="h-[1.1rem] w-[1.1rem] shrink-0 opacity-90" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
