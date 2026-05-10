import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

type GateState = "loading" | "ok" | "redirecting";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (cancelled) return;
        if (res.ok) {
          setState("ok");
          return;
        }
        setState("redirecting");
        await navigate({
          to: "/login",
          search: { redirect: "/admin" },
          replace: true,
        });
      } catch {
        if (!cancelled) setState("redirecting");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-hero text-th-cream"
        dir="rtl"
      >
        <p className="text-sm text-th-lavender/80">جاري التحقق من الجلسة…</p>
      </div>
    );
  }

  if (state === "redirecting") {
    return null;
  }

  return <>{children}</>;
}
