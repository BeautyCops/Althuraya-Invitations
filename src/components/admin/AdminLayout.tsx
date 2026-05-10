import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { AdminSidebar, type AdminSection } from "./AdminSidebar";
import { OverviewSection } from "./sections/OverviewSection";
import { InvitationsSection } from "./sections/InvitationsSection";
import { UsersSection } from "./sections/UsersSection";
import { EventsSection } from "./sections/EventsSection";
import { PaymentsSection } from "./sections/PaymentsSection";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { TemplatesSection } from "./sections/TemplatesSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { SettingsSection } from "./sections/SettingsSection";

const titles: Record<AdminSection, string> = {
  overview: "نظرة عامة",
  invitations: "الدعوات",
  users: "المستخدمون",
  events: "المناسبات",
  payments: "المدفوعات",
  analytics: "التحليلات",
  templates: "القوالب",
  notifications: "الإشعارات",
  settings: "الإعدادات",
};

export function AdminLayout() {
  const [active, setActive] = useState<AdminSection>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderSection = () => {
    switch (active) {
      case "overview":
        return <OverviewSection />;
      case "invitations":
        return <InvitationsSection />;
      case "users":
        return <UsersSection />;
      case "events":
        return <EventsSection />;
      case "payments":
        return <PaymentsSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "templates":
        return <TemplatesSection />;
      case "notifications":
        return <NotificationsSection />;
      case "settings":
        return <SettingsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex" dir="rtl">
      <div className="hidden lg:flex shrink-0 self-stretch">
        <AdminSidebar active={active} onChange={setActive} />
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-50 bg-black/60"
            aria-label="إغلاق القائمة"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="admin-mobile-sidebar"
            className="lg:hidden fixed inset-y-0 z-[60] start-0 w-[min(16rem,88vw)] shadow-card-soft overflow-hidden"
          >
            <AdminSidebar
              active={active}
              onChange={(s) => {
                setActive(s);
                setMobileOpen(false);
              }}
              className="h-full border-e"
            />
          </div>
        </>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 glass-strong border-b border-th-lavender/10 px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden text-th-cream -me-1"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-bold text-th-cream text-lg shrink-0 min-w-0 truncate">
            {titles[active]}
          </h2>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto bg-th-deep/40 rounded-xl px-4 py-2 border border-th-lavender/10">
            <Search className="h-4 w-4 text-th-lavender/60 shrink-0" />
            <input
              placeholder="بحث سريع..."
              className="bg-transparent flex-1 min-w-0 outline-none text-sm text-th-cream placeholder:text-th-lavender/50"
            />
          </div>
          <div className="flex items-center gap-3 ms-auto">
            <button
              type="button"
              className="rounded-lg border border-th-lavender/25 px-3 py-1.5 text-sm text-th-cream hover:bg-th-deep/80"
              onClick={() => {
                void (async () => {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  window.location.href = "/login";
                })();
              }}
            >
              خروج
            </button>
            <button
              type="button"
              className="relative text-th-lavender hover:text-th-cream"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-th-cream font-bold text-sm">
              أ
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">{renderSection()}</div>
      </main>
    </div>
  );
}
