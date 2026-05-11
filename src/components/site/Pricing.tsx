import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { LOGIN_PATH } from "@/lib/site-links";

const plans = [
  {
    name: "الأساسية",
    price: "٩٩",
    desc: "لمناسبة واحدة صغيرة.",
    features: [
      "حتى ٥٠ مدعوًا",
      "٥ قوالب أساسية",
      "نظام RSVP ذكي",
      "إرسال عبر واتساب",
      "دعم بالبريد الإلكتروني",
    ],
    cta: "ابدأ الآن",
    ctaHref: LOGIN_PATH,
    ctaRegister: true,
    highlighted: false,
  },
  {
    name: "الفاخرة",
    price: "٢٩٩",
    desc: "الأكثر طلبًا للأفراح والفعاليات.",
    features: [
      "حتى ٣٠٠ مدعوًا",
      "كل القوالب الفاخرة",
      "تخصيص كامل للتصميم",
      "إرسال متعدد القنوات",
      "تحليلات متقدمة",
      "دعم أولوية ٢٤/٧",
    ],
    cta: "اختر الفاخرة",
    highlighted: true,
  },
  {
    name: "الأعمال",
    price: "حسب الطلب",
    desc: "للمؤتمرات والمعارض الكبرى.",
    features: [
      "ضيوف غير محدودين",
      "تصميم حصري بأيدي مصممينا",
      "نظام check-in بالـ QR",
      "تقارير حضور مفصّلة",
      "مدير حساب مخصص",
    ],
    cta: "تواصل مع المبيعات",
    ctaHref: "#contact",
    ctaRegister: false,
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs text-th-lavender-soft mb-5">
            الباقات
          </div>
          <h2
            className="text-gradient text-4xl sm:text-5xl font-bold leading-tight mb-5"
            style={{ fontFamily: "var(--font-serif-arabic)" }}
          >
            باقة تناسب كل مناسبة
          </h2>
          <p className="text-th-cream/70 text-lg leading-relaxed">
            أسعار شفافة بدون رسوم خفية — اختر ما يناسب حجم فعاليتك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 transition-all ${
                p.highlighted
                  ? "bg-gradient-primary shadow-glow lg:-translate-y-3"
                  : "glass hover:bg-th-royal/15"
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-th-cream text-th-deep text-xs font-bold px-4 py-1 rounded-full">
                  الأكثر شعبية
                </div>
              )}
              <h3 className="text-xl font-bold text-th-cream mb-2">{p.name}</h3>
              <p className="text-th-cream/65 text-sm mb-6">{p.desc}</p>
              <div className="flex items-baseline gap-2 mb-7">
                <span
                  className="text-5xl font-bold text-th-cream"
                  style={{ fontFamily: "var(--font-serif-arabic)" }}
                >
                  {p.price}
                </span>
                {p.price !== "حسب الطلب" && (
                  <span className="text-th-cream/65 text-sm">ر.س / مناسبة</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-th-cream/85 text-sm"
                  >
                    <Check className="h-4 w-4 text-th-lavender flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {p.ctaRegister ? (
                <Link
                  to={p.ctaHref}
                  search={{ mode: "register" }}
                  className={`block text-center py-3 rounded-full font-medium transition-all ${
                    p.highlighted
                      ? "bg-th-cream text-th-deep hover:bg-th-lavender-soft"
                      : "glass text-th-cream hover:bg-th-royal/30"
                  }`}
                >
                  {p.cta}
                </Link>
              ) : (
                <a
                  href={p.ctaHref}
                  className={`block text-center py-3 rounded-full font-medium transition-all ${
                    p.highlighted
                      ? "bg-th-cream text-th-deep hover:bg-th-lavender-soft"
                      : "glass text-th-cream hover:bg-th-royal/30"
                  }`}
                >
                  {p.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
