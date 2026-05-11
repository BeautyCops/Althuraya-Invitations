import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import heroPhones from "@/assets/hero-phones.png";
import { LOGIN_PATH } from "@/lib/site-links";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-4">
          <div className="w-full text-center order-1 lg:order-none lg:col-span-7 lg:row-span-2 max-w-3xl mx-auto lg:mx-0 lg:text-right lg:pr-3 xl:pr-4 lg:self-stretch flex flex-col justify-between">
            <div className="mb-6 sm:mb-6 lg:mb-0 mt-8 sm:mt-10 lg:mt-14">
              <h1
                className="text-gradient font-bold leading-tight sm:leading-[1.05] mb-4 sm:mb-5 animate-fade-up whitespace-nowrap text-4xl sm:text-6xl md:text-7xl lg:text-7xl"
                style={{
                  fontFamily: "var(--font-serif-arabic)",
                  animationDelay: "0.1s",
                }}
              >
                دعواتك تستحق{" "}
                <span className="text-gradient-lavender">لمسة فاخرة</span>
              </h1>

              <p
                className="text-[0.95rem] sm:text-lg text-th-cream/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                صمّم، أرسل، وأدر دعواتك الإلكترونية لحفلات الزفاف والمؤتمرات
                والفعاليات الخاصة بكل سهولة — مع نظام RSVP ذكي وتحليلات حضور
                لحظية.
              </p>
            </div>

            <div className="order-2 lg:order-none w-full text-center lg:text-right max-sm:px-0.5">
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4 sm:mb-5 w-full sm:w-auto max-w-md sm:max-w-none mx-auto lg:mx-0 animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                <Link
                  to={LOGIN_PATH}
                  search={{ mode: "register" }}
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-gradient-primary text-th-cream px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold hover:shadow-glow transition-all"
                >
                  أنشئ دعوتك الآن
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 glass text-th-cream px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:bg-th-royal/30 transition-colors"
                >
                  تعرّف على خدماتنا
                </a>
              </div>

              <div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2.5 sm:gap-x-8 sm:gap-y-3 text-th-cream/55 text-xs sm:text-sm animate-fade-up max-w-sm sm:max-w-none mx-auto lg:mx-0"
                style={{ animationDelay: "0.4s" }}
              >
                {[
                  "٥٠ مناسبة",
                  "١٢٠٠ ضيف",
                  "تقييم ٤.٩ ★",
                  "دعم ٢٤/٧",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-th-lavender" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-[10.5rem] sm:max-w-[12.5rem] order-3 -mt-1 sm:mt-0 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:mt-0 lg:max-w-[12.5rem] xl:max-w-[13.5rem] animate-fade-up lg:justify-self-center lg:pl-1 lg:self-stretch min-h-0 flex flex-col items-center justify-center"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="relative w-full max-w-full lg:-translate-x-2">
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-16 blur-2xl scale-80" />
              <img
                src={heroPhones}
                alt="واجهة دعوة رقمية على هواتف ذكية"
                className="relative w-full h-auto max-h-[15rem] sm:max-h-[16.5rem] mx-auto object-contain drop-shadow-[0_12px_40px_rgba(184,164,212,0.18)] lg:w-full lg:h-full lg:max-w-full lg:max-h-full lg:object-contain"
              />
            </div>
          </div>
        </div>

        {/* Floating preview cards */}
        <div className="relative mt-20 sm:mt-24 lg:mt-16 max-w-5xl mx-auto">
          <div className="absolute inset-0 -m-6 sm:-m-10 bg-gradient-primary opacity-30 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-card-soft">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-th-deep-2 aspect-[3/2] min-h-[10.5rem] sm:min-h-0 sm:aspect-[16/9] grid grid-cols-12 gap-1.5 sm:gap-3 p-2.5 sm:p-4 lg:p-5">
              <div className="col-span-3 flex flex-col gap-1.5 sm:gap-2 lg:gap-3 min-w-0">
                {[
                  "لوحة التحكم",
                  "دعواتي",
                  "الضيوف",
                  "التحليلات",
                  "الإعدادات",
                ].map((t, i) => (
                  <div
                    key={t}
                    className={`text-[0.6rem] leading-tight sm:text-xs px-1.5 py-1.5 sm:px-2.5 sm:py-2 lg:px-3 rounded-md sm:rounded-lg truncate ${
                      i === 0
                        ? "bg-gradient-primary text-th-cream"
                        : "text-th-cream/60 hover:bg-white/5"
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="col-span-9 flex flex-col gap-1.5 sm:gap-2 lg:gap-3 min-w-0">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
                  {[
                    { l: "إجمالي الضيوف", v: "٣٢٤" },
                    { l: "تأكيد الحضور", v: "٢٧٨" },
                    { l: "نسبة الفتح", v: "٩٢٪" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="glass rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 md:p-3"
                    >
                      <div className="text-[0.6rem] sm:text-[10px] text-th-cream/55 leading-snug sm:leading-tight line-clamp-2">
                        {s.l}
                      </div>
                      <div className="text-sm sm:text-lg md:text-xl font-bold text-th-cream mt-0.5 sm:mt-1 leading-none">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="glass rounded-lg sm:rounded-xl flex-1 p-1.5 sm:p-2.5 md:p-3 flex items-end gap-0.5 sm:gap-1 md:gap-2 min-h-0">
                  {[40, 65, 50, 80, 70, 95, 60, 85, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-primary rounded-t-md"
                      style={{ height: `${h}%`, opacity: 0.4 + (i / 9) * 0.6 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
