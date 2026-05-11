import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DEFAULT_USER_REDIRECT } from "@/lib/site-links";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" && search.redirect.startsWith("/")
        ? search.redirect
        : DEFAULT_USER_REDIRECT,
    mode: search.mode === "register" ? ("register" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — الثريا" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const { redirect, mode: modeFromUrl } = search;
  const [mode, setMode] = useState<"login" | "register">(
    modeFromUrl === "register" ? "register" : "login",
  );

  useEffect(() => {
    setMode(modeFromUrl === "register" ? "register" : "login");
  }, [modeFromUrl]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, displayName: displayName.trim() || undefined };
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.message ?? "حدث خطأ. حاول مرة أخرى.");
        return;
      }
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      const me = meRes.ok
        ? ((await meRes.json()) as { user?: { role?: string } })
        : null;
      const role = me?.user?.role;
      let target = redirect;
      if (target === "/admin" && role !== "admin") {
        target = DEFAULT_USER_REDIRECT;
      }
      window.location.assign(target);
    } catch {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero px-4 py-12"
      dir="rtl"
    >
      <div className="w-full max-w-md rounded-2xl border border-th-lavender/15 bg-th-deep/60 backdrop-blur-md p-6 md:p-8 shadow-card-soft">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="text-th-lavender/70 text-sm hover:text-th-cream transition-colors"
          >
            ← العودة للرئيسية
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-th-cream">الثريا</h1>
          <p className="mt-2 text-sm text-th-lavender/70">
            {mode === "login" ? "سجّلي الدخول للمتابعة" : "أنشئي حسابًا جديدًا"}
          </p>
        </div>

        <div className="flex gap-2 rounded-xl bg-th-deep/80 p-1 mb-6">
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-gradient-primary text-th-cream"
                : "text-th-lavender/70 hover:text-th-cream"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
          >
            دخول
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-gradient-primary text-th-cream"
                : "text-th-lavender/70 hover:text-th-cream"
            }`}
            onClick={() => {
              setMode("register");
              setError(null);
            }}
          >
            تسجيل
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm text-th-lavender/80 mb-1"
              >
                الاسم (اختياري)
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/50 px-4 py-3 text-th-cream placeholder:text-th-lavender/40 outline-none focus:border-primary"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-th-lavender/80 mb-1"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/50 px-4 py-3 text-th-cream placeholder:text-th-lavender/40 outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-th-lavender/80 mb-1"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={8}
              className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/50 px-4 py-3 text-th-cream placeholder:text-th-lavender/40 outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {mode === "register" && (
              <p className="mt-1 text-xs text-th-lavender/50">
                8 أحرف على الأقل.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-primary py-3 font-semibold text-th-cream disabled:opacity-60"
          >
            {loading
              ? "جاري الإرسال…"
              : mode === "login"
                ? "دخول"
                : "إنشاء الحساب"}
          </button>
        </form>
      </div>
    </div>
  );
}
