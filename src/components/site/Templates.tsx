import { Link } from "@tanstack/react-router";

import wedding from "@/assets/template-wedding.jpg";
import { LOGIN_PATH } from "@/lib/site-links";
import corporate from "@/assets/template-corporate.jpg";
import birthday from "@/assets/template-birthday.jpg";

const templates = [
  {
    img: wedding,
    title: "دعوات الأعراس",
    tag: "كلاسيكي فاخر",
    count: "+٤٠ قالب",
  },
  {
    img: corporate,
    title: "المؤتمرات والشركات",
    tag: "احترافي",
    count: "+٣٠ قالب",
  },
  {
    img: birthday,
    title: "أعياد الميلاد والمناسبات",
    tag: "حيوي",
    count: "+٢٥ قالب",
  },
];

export function Templates() {
  return (
    <section id="templates" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs text-th-lavender-soft mb-5">
              القوالب
            </div>
            <h2
              className="text-gradient text-4xl sm:text-5xl font-bold leading-tight mb-4"
              style={{ fontFamily: "var(--font-serif-arabic)" }}
            >
              قوالب صُمّمت لتُبهر
            </h2>
            <p className="text-th-cream/70 text-lg leading-relaxed">
              أكثر من ١٠٠ تصميم حصري يغطّي كل أنواع المناسبات.
            </p>
          </div>
          <Link
            to={LOGIN_PATH}
            search={{ mode: "register" }}
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm text-th-cream hover:bg-th-royal/30 transition-colors self-start"
          >
            عرض كل القوالب ←
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div
              key={t.title}
              className="group relative rounded-3xl overflow-hidden glass shadow-card-soft hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={t.img}
                  alt={t.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-th-deep-2 via-th-deep-2/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="text-xs text-th-lavender mb-2">{t.tag}</div>
                <h3 className="text-2xl font-bold text-th-cream mb-1">
                  {t.title}
                </h3>
                <div className="text-sm text-th-cream/65">{t.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
