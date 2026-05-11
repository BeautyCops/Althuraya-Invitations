import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { AccountKindChooser } from "./AccountKindChooser";
import {
  readAccountKind,
  writeAccountKind,
  type DashboardAccountKind,
} from "./account-kind";
import {
  DASHBOARD_TAB_LABELS,
  dashboardTabsForKind,
} from "./dashboard-nav-config";
import { DEFAULT_DASHBOARD_TAB, type DashboardTab } from "./dashboard-tabs";
import { useDashboardUser } from "./dashboard-user-context";
import { DashboardSidebar } from "./DashboardSidebar";
import { CreateIndividualOccasionWizard } from "./sections/create-individual/CreateIndividualOccasionWizard";
import { HomeSection } from "./sections/HomeSection";
import { PlaceholderSection } from "./sections/PlaceholderSection";
import { SettingsSection } from "./sections/SettingsSection";

export function DashboardWorkspace({ tab }: { tab: DashboardTab }) {
  const user = useDashboardUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountKind, setAccountKindState] =
    useState<DashboardAccountKind | null>(null);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAccountKindState(readAccountKind());
    setHydrated(true);
  }, []);

  const showChooser = hydrated && accountKind === null;

  useEffect(() => {
    if (!accountKind) return;
    const allowed = new Set(dashboardTabsForKind(accountKind));
    if (!allowed.has(tab)) {
      void navigate({
        to: "/dashboard",
        search: { tab: DEFAULT_DASHBOARD_TAB },
        replace: true,
      });
    }
  }, [accountKind, tab, navigate]);

  function setAccountKind(kind: DashboardAccountKind) {
    writeAccountKind(kind);
    setAccountKindState(kind);
  }

  function resetKindChooser() {
    setAccountKindState(null);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.assign("/");
  }

  const kindOrFallback = accountKind ?? "individual";

  const sectionTitle = DASHBOARD_TAB_LABELS[tab];

  function renderSection() {
    if (!accountKind) return null;
    switch (tab) {
      case "home":
        return <HomeSection email={user.email} accountKind={accountKind} />;
      case "create":
        return accountKind === "individual" ? (
          <CreateIndividualOccasionWizard />
        ) : (
          <PlaceholderSection
            tab={tab}
            subtitle="مسار إنشاء الفعاليات للشركات سيُضاف هنا لاحقًا مع صلاحيات تناسب الشركات وفِرق العمل."
            bullets={[
              "نسخة متعددة المناسبات والجهات.",
              "ربط بنفس خطوات الأفراد مع حقول إضافية للشركة.",
            ]}
          />
        );
      case "settings":
        return (
          <SettingsSection
            accountKind={accountKind}
            onChangeKind={resetKindChooser}
          />
        );
      case "help":
        return (
          <div className="max-w-3xl mx-auto rounded-3xl border border-th-lavender/15 bg-th-deep/45 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-th-cream mb-4">
              مركز المساعدة
            </h2>
            <p className="text-th-lavender/80 mb-6 leading-relaxed">
              تصفّحي مقالات المساعدة العامة أو تواصلي مع الدعم لاحقًا من هذه
              المنطقة.
            </p>
            <Link
              to="/help-center"
              className="inline-flex rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-th-cream hover:shadow-glow transition-all"
            >
              فتح مركز المساعدة
            </Link>
          </div>
        );
      default:
        return <PlaceholderSection tab={tab} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex relative" dir="rtl">
      {showChooser && (
        <AccountKindChooser
          onChoose={(k) => {
            setAccountKind(k);
          }}
        />
      )}

      <div className="hidden lg:flex shrink-0 self-stretch">
        <DashboardSidebar
          activeTab={tab}
          accountKind={kindOrFallback}
          className="min-h-screen"
        />
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-50 bg-black/60"
            aria-label="إغلاق القائمة"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 z-[60] start-0 w-[min(17rem,92vw)] shadow-card-soft overflow-hidden">
            <DashboardSidebar
              activeTab={tab}
              accountKind={kindOrFallback}
              onCloseMobile={() => setMobileOpen(false)}
              className="min-h-full border-e"
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
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-th-cream text-lg shrink-0 min-w-0 truncate">
            {sectionTitle}
          </h1>
          <div className="flex items-center gap-2 ms-auto">
            <Link
              to="/"
              className="hidden sm:inline text-xs text-th-lavender/75 hover:text-th-cream px-2"
            >
              الموقع
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-lg border border-th-lavender/25 px-3 py-1.5 text-xs text-th-cream hover:bg-th-deep/80"
              >
                لوحة الإدارة
              </Link>
            )}
            <button
              type="button"
              className="relative text-th-lavender hover:text-th-cream p-1"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-th-lavender/25 px-3 py-1.5 text-sm text-th-cream hover:bg-th-deep/80"
            >
              خروج
            </button>
          </div>
        </header>

        <div
          className={cn(
            "p-4 md:p-8 flex-1",
            showChooser && "pointer-events-none opacity-0 sm:opacity-40",
          )}
        >
          {!hydrated ? (
            <div className="flex justify-center py-20">
              <p className="text-sm text-th-lavender/70">جاري التحميل…</p>
            </div>
          ) : !accountKind ? null : (
            renderSection()
          )}
        </div>
      </main>
    </div>
  );
}
