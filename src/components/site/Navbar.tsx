import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { LOGIN_PATH } from "@/lib/site-links";

import { Logo } from "./Logo";

const links = [
  { href: "#features", label: "المميزات" },
  { href: "#services", label: "خدماتنا" },
  { href: "#how", label: "كيف نعمل" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all">
      <div className="container mx-auto px-4 sm:px-6 pt-4">
        <nav className="glass-strong rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-soft">
          <Logo />
          <ul className="hidden lg:flex items-center gap-7 text-sm text-th-cream/80">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="hover:text-th-cream transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={LOGIN_PATH}
              className="text-sm text-th-cream/80 hover:text-th-cream px-4 py-2 transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              to={LOGIN_PATH}
              search={{ mode: "register" }}
              className="text-sm bg-gradient-primary text-th-cream px-5 py-2.5 rounded-full font-medium hover:shadow-glow transition-all"
            >
              ابدأ مجانًا
            </Link>
          </div>
          <button
            className="lg:hidden text-th-cream p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-3xl p-5 shadow-card-soft animate-fade-up">
            <ul className="flex flex-col gap-4 text-th-cream/85">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-1"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to={LOGIN_PATH}
                  search={{ mode: "register" }}
                  onClick={() => setOpen(false)}
                  className="block text-center bg-gradient-primary text-th-cream py-3 rounded-full font-medium mt-2"
                >
                  ابدأ مجانًا
                </Link>
              </li>
              <li>
                <Link
                  to={LOGIN_PATH}
                  onClick={() => setOpen(false)}
                  className="block text-center py-2 text-th-cream/85 border border-th-lavender/25 rounded-full text-sm mt-2"
                >
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
