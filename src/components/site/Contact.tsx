import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";

import { LOGIN_PATH } from "@/lib/site-links";
import type { ContactPayload } from "@/lib/contact-schema";

export function Contact() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const contactUrl =
      import.meta.env.VITE_CONTACT_API_URL?.trim() || "/api/contact";

    try {
      const response = await fetch(contactUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "تعذر إرسال الطلب.");
      }

      setFeedback({
        type: "success",
        text: result.message || "تم إرسال طلبك بنجاح.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-primary p-1 shadow-glow">
          <div className="rounded-[calc(2.5rem-4px)] bg-th-deep-2/85 backdrop-blur-xl p-10 sm:p-14 text-center">
            <h2
              className="text-gradient text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5"
              style={{ fontFamily: "var(--font-serif-arabic)" }}
            >
              جاهزون لإبهار ضيوفك؟
            </h2>
            <p className="text-th-cream/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              ابدأ مجانًا اليوم وأنشئ أول دعوة فاخرة لمناسبتك القادمة. فريقنا
              جاهز لمساعدتك في كل خطوة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                to={LOGIN_PATH}
                search={{ mode: "register" }}
                className="bg-th-cream text-th-deep px-8 py-3.5 rounded-full font-semibold hover:bg-th-lavender-soft transition-colors w-full sm:w-auto text-center"
              >
                ابدأ الآن مجانًا
              </Link>
              <a
                href="tel:0547870867"
                className="glass-strong text-th-cream px-8 py-3.5 rounded-full font-semibold hover:bg-th-royal/30 transition-colors w-full sm:w-auto"
              >
                تحدث مع المبيعات
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10 text-right"
            >
              <label className="block">
                <span className="mb-2 block text-sm text-th-cream/75">
                  الاسم
                </span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-th-cream outline-none transition-colors placeholder:text-th-cream/35 focus:border-th-lavender/40"
                  placeholder="الاسم الكامل"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-th-cream/75">
                  البريد الإلكتروني
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-th-cream outline-none transition-colors placeholder:text-th-cream/35 focus:border-th-lavender/40"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  dir="ltr"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-th-cream/75">
                  رقم الجوال
                </span>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-th-cream outline-none transition-colors placeholder:text-th-cream/35 focus:border-th-lavender/40"
                  placeholder="05xxxxxxxx"
                  autoComplete="tel"
                  required
                  dir="ltr"
                />
              </label>

              <div className="hidden md:block" />

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-th-cream/75">
                  تفاصيل الطلب
                </span>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      message: e.target.value,
                    }))
                  }
                  className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-th-cream outline-none transition-colors placeholder:text-th-cream/35 focus:border-th-lavender/40"
                  placeholder="اذكر نوع المناسبة، التاريخ، وعدد الضيوف أو أي تفاصيل مهمة."
                  required
                />
              </label>

              <div className="md:col-span-2 flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-full bg-th-cream px-8 py-3.5 font-semibold text-th-deep transition-colors hover:bg-th-lavender-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>

                {feedback && (
                  <p
                    className={`text-sm ${
                      feedback.type === "success"
                        ? "text-th-lavender-soft"
                        : "text-red-200"
                    }`}
                  >
                    {feedback.text}
                  </p>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10">
              {[
                {
                  icon: Mail,
                  label: "البريد",
                  value: "info@Althuraya.store",
                  href: "mailto:info@Althuraya.store",
                },
                {
                  icon: Phone,
                  label: "الجوال",
                  value: "0547870867",
                  href: "tel:0547870867",
                },
                {
                  icon: MessageCircle,
                  label: "واتساب",
                  value: "تواصل فوري",
                  href: "https://wa.me/966547870867",
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-3 justify-center sm:justify-start glass rounded-2xl px-4 py-3 hover:bg-th-royal/30 transition-colors"
                >
                  <div className="bg-gradient-primary h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <c.icon className="h-4 w-4 text-th-cream" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-th-cream/55">
                      {c.label}
                    </div>
                    <div
                      className="text-sm text-th-cream font-medium"
                      dir="ltr"
                    >
                      {c.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
