export function OverviewSection() {
  const stats = [
    { label: "دعوات نشطة", value: "—" },
    { label: "استجابات هذا الأسبوع", value: "—" },
    { label: "مستخدمون مسجّلون", value: "—" },
    { label: "إيرادات الشهر", value: "—" },
  ];
  return (
    <div className="space-y-6">
      <p className="text-sm text-th-lavender/75 max-w-2xl">
        ملخص سريع للمنصة. سيتم ربط الأرقام بمصدر البيانات لاحقاً.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-strong rounded-2xl border border-th-lavender/10 p-5"
          >
            <p className="text-xs text-th-lavender/70 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-th-cream">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
