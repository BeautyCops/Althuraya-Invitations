import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type MeUser = { id: string; email: string; role: "user" | "admin" };

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي — الثريا" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (cancelled) return;
        if (!res.ok) {
          await navigate({
            to: "/login",
            search: { redirect: "/account" },
            replace: true,
          });
          return;
        }
        const data = (await res.json()) as { user?: MeUser };
        if (!data.user) {
          await navigate({
            to: "/login",
            search: { redirect: "/account" },
            replace: true,
          });
          return;
        }
        setUser(data.user);
      } catch {
        if (!cancelled) {
          await navigate({
            to: "/login",
            search: { redirect: "/account" },
            replace: true,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.assign("/");
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-hero text-th-cream"
        dir="rtl"
      >
        <p className="text-sm text-th-lavender/80">جاري التحميل…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero px-4 py-12"
      dir="rtl"
    >
      <div className="w-full max-w-md rounded-2xl border border-th-lavender/15 bg-th-deep/60 backdrop-blur-md p-6 md:p-8 shadow-card-soft text-center">
        <h1 className="text-2xl font-bold text-th-cream mb-2">حسابي</h1>
        <p className="text-sm text-th-lavender/80 mb-6 break-all">{user.email}</p>
        <p className="text-sm text-th-cream/80 mb-6 leading-relaxed">
          {user.role === "admin"
            ? "لديك صلاحية مشرف — يمكنك فتح لوحة الإدارة."
            : "هذه مساحة حسابك. لوحة الإدارة الكاملة مخصّصة للمشرفين فقط؛ لأي طلب صلاحية تواصلي مع الدعم."}
        </p>
        <div className="flex flex-col gap-3">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="block w-full rounded-xl bg-gradient-primary py-3 font-semibold text-th-cream text-center"
            >
              فتح لوحة الإدارة
            </Link>
          )}
          <Link
            to="/"
            className="block w-full rounded-xl border border-th-lavender/25 py-3 text-th-cream/90 hover:bg-th-royal/20 transition-colors text-center text-sm"
          >
            العودة للموقع
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl py-3 text-sm text-th-lavender/90 hover:text-th-cream transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
