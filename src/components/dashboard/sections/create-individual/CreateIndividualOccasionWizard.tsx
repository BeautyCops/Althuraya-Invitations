import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Layers,
  MapPin,
  MonitorSmartphone,
  Music,
  Palette,
  Sparkles,
  TabletSmartphone,
  Trash2,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  IndividualOccasionWizardState,
  InvitationProductKind,
  OccasionTypeId,
  WizardStepIndex,
} from "./types";
import { OCCASION_TYPE_OPTIONS } from "./types";
import {
  COLOR_FILTER_PRESETS,
  createInitialWizardState,
  FONT_PRESETS,
  loadWizardDraft,
  MOCK_TEMPLATES,
  saveWizardDraft,
  TEMPLATE_CATEGORIES,
  clearWizardDraft,
} from "./wizard-defaults";

const STEP_LABELS: Record<WizardStepIndex, string> = {
  1: "معلومات المناسبة",
  2: "نوع الدعوة",
  3: "اختيار التصميم",
  4: "تخصيص التصميم",
  5: "معاينة نهائية",
  6: "حفظ ونشر",
};

const INVITATION_OPTIONS: {
  id: InvitationProductKind;
  title: string;
  description: string;
}[] = [
  {
    id: "design_only",
    title: "تصميم فقط",
    description:
      "تحصلين على التصميم وتشاركينه بنفسك مع ضيوفك (مراسلاتك الخاصة).",
  },
  {
    id: "qr_track",
    title: "إرسال دعوة خاصة + QR وتتبّع",
    description: "دعوة شخصية مع رمز QR ومتابعة الحالة والوصول لاحقًا.",
  },
  {
    id: "interactive",
    title: "دعوات تفاعلية",
    description:
      "تجربة غنية بالحركة والتفاعل حسب الخطة (قريبًا بالكامل مع الخلفية).",
  },
];

function validateStep1(s: IndividualOccasionWizardState): boolean {
  const { event } = s;
  return Boolean(
    event.name.trim() &&
    event.occasionType &&
    event.date &&
    event.startTime &&
    event.endTime &&
    event.location.trim(),
  );
}

function validateStep2(s: IndividualOccasionWizardState): boolean {
  return Boolean(s.invitationKind);
}

function validateStep3(s: IndividualOccasionWizardState): boolean {
  const { design } = s;
  if (design.sourceTab === "upload") return Boolean(design.uploadedFileName);
  if (design.sourceTab === "custom")
    return design.customRequestNotes.trim().length >= 8;
  return Boolean(design.selectedTemplateId);
}

export function CreateIndividualOccasionWizard() {
  const [state, setState] = useState<IndividualOccasionWizardState>(() =>
    createInitialWizardState(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [motionPreviewOn, setMotionPreviewOn] = useState(false);

  useEffect(() => {
    const draft = loadWizardDraft();
    if (draft) setState(draft);
    setHydrated(true);
  }, []);

  function patch(partial: Partial<IndividualOccasionWizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((t) => {
      if (
        state.design.templateCategoryFilter &&
        t.categoryId !== state.design.templateCategoryFilter
      )
        return false;
      if (
        state.design.colorFilter &&
        !t.accentColors.includes(
          COLOR_FILTER_PRESETS.find((c) => c.id === state.design.colorFilter)
            ?.hex ?? "",
        )
      )
        return false;
      if (
        state.design.occasionTemplateFilter &&
        !t.occasionTags.includes(state.design.occasionTemplateFilter)
      )
        return false;
      return true;
    });
  }, [
    state.design.templateCategoryFilter,
    state.design.colorFilter,
    state.design.occasionTemplateFilter,
  ]);

  const selectedTemplate = MOCK_TEMPLATES.find(
    (t) => t.id === state.design.selectedTemplateId,
  );

  function canGoNext(from: WizardStepIndex): boolean {
    switch (from) {
      case 1:
        return validateStep1(state);
      case 2:
        return validateStep2(state);
      case 3:
        return validateStep3(state);
      default:
        return true;
    }
  }

  function goNext() {
    if (state.step >= 6 || !canGoNext(state.step)) return;
    patch({ step: (state.step + 1) as WizardStepIndex });
  }

  function goBack() {
    if (state.step <= 1) return;
    patch({ step: (state.step - 1) as WizardStepIndex });
  }

  function toggleFavorite(id: string) {
    setState((prev) => {
      const set = new Set(prev.design.favorites);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return {
        ...prev,
        design: { ...prev.design, favorites: [...set] },
      };
    });
  }

  function toggleCompare(id: string) {
    setState((prev) => {
      let next = [...prev.design.compareIds];
      if (next.includes(id)) next = next.filter((x) => x !== id);
      else if (next.length >= 2) next = [next[1]!, id];
      else next = [...next, id];
      return {
        ...prev,
        design: { ...prev.design, compareIds: next },
      };
    });
  }

  const previewHeadline =
    state.customization.headlineText.trim() ||
    state.event.name.trim() ||
    "معاينة عنوان الدعوة";

  const previewBody =
    state.customization.bodyText.trim() ||
    state.event.description.trim() ||
    "نص ترحيبي أو تفاصيل مختصرة تظهر هنا في المعاينة.";

  if (!hydrated) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-th-lavender/70">جاري تحميل المعالج…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-th-lavender/25 bg-th-deep/95 px-5 py-2 text-sm text-th-cream shadow-card-soft"
          role="status"
        >
          {toast}
        </div>
      )}

      <div className="rounded-3xl border border-th-lavender/15 bg-th-deep/45 p-6 md:p-8 shadow-card-soft">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-th-lavender/65 mb-1">
              إنشاء مناسبة جديدة · أفراد
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-th-cream">
              المعالج التفاعلي — {STEP_LABELS[state.step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              clearWizardDraft();
              setState(createInitialWizardState());
              showToast("تمت إعادة المعالج من البداية.");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-th-lavender/25 px-3 py-2 text-xs text-th-lavender/85 hover:bg-th-royal/15 hover:text-th-cream transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            مسح المسودة والبدء من جديد
          </button>
        </div>

        <ol className="flex flex-wrap gap-2 mb-8">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => patch({ step: n })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                  state.step === n
                    ? "border-th-lavender/40 bg-th-royal/35 text-th-cream"
                    : "border-th-lavender/15 text-th-lavender/75 hover:border-th-lavender/30 hover:text-th-cream",
                )}
              >
                {n}. {STEP_LABELS[n]}
              </button>
            </li>
          ))}
        </ol>

        {/* الخطوة ١ */}
        {state.step === 1 && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm text-th-cream">اسم المناسبة</span>
                <input
                  type="text"
                  value={state.event.name}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, name: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream placeholder:text-th-lavender/45 focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                  placeholder="مثال: زفاف أحمد وسارة"
                />
              </label>

              <fieldset className="md:col-span-2 space-y-2">
                <legend className="text-sm text-th-cream mb-2">
                  نوع المناسبة
                </legend>
                <div className="flex flex-wrap gap-2">
                  {OCCASION_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          event: { ...p.event, occasionType: opt.id },
                          design: {
                            ...p.design,
                            occasionTemplateFilter:
                              p.design.occasionTemplateFilter || opt.id,
                          },
                        }))
                      }
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs border transition-colors",
                        state.event.occasionType === opt.id
                          ? "border-th-lavender/45 bg-gradient-primary text-th-cream"
                          : "border-th-lavender/20 text-th-lavender/85 hover:border-th-lavender/35",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-th-lavender/70" />
                  تاريخ المناسبة
                </span>
                <input
                  type="date"
                  value={state.event.date}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, date: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream flex items-center gap-2">
                  <Clock className="h-4 w-4 text-th-lavender/70" />
                  وقت البداية
                </span>
                <input
                  type="time"
                  value={state.event.startTime}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, startTime: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                />
              </label>

              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm text-th-cream flex items-center gap-2">
                  <Clock className="h-4 w-4 text-th-lavender/70" />
                  وقت النهاية
                </span>
                <input
                  type="time"
                  value={state.event.endTime}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, endTime: e.target.value },
                    }))
                  }
                  className="w-full md:max-w-xs rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                />
              </label>

              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm text-th-cream flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-th-lavender/70" />
                  الموقع
                </span>
                <input
                  type="text"
                  value={state.event.location}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, location: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream placeholder:text-th-lavender/45 focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                  placeholder="اسم القاعة أو العنوان"
                />
              </label>

              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm text-th-cream">
                  رابط Google Maps (اختياري)
                </span>
                <input
                  type="url"
                  dir="ltr"
                  value={state.event.mapsUrl}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, mapsUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream placeholder:text-th-lavender/45 focus:outline-none focus:ring-2 focus:ring-th-royal/50"
                  placeholder="https://maps.google.com/..."
                />
              </label>

              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm text-th-cream">
                  وصف مختصر (اختياري)
                </span>
                <textarea
                  value={state.event.description}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      event: { ...p.event, description: e.target.value },
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-4 py-2.5 text-sm text-th-cream placeholder:text-th-lavender/45 focus:outline-none focus:ring-2 focus:ring-th-royal/50 resize-y min-h-[5rem]"
                  placeholder="تفاصيل إضافية للمدعوين…"
                />
              </label>
            </div>
            {!validateStep1(state) && (
              <p className="text-xs text-amber-200/90">
                أكملي الحقول الإلزامية: اسم المناسبة، النوع، التاريخ، أوقات
                البداية والنهاية، والموقع.
              </p>
            )}
          </div>
        )}

        {/* الخطوة ٢ */}
        {state.step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-th-lavender/80 leading-relaxed">
              اختاري ما تحتاجينه من الدعوة. يمكن ربط كل خيار بالفوترة لاحقًا عبر
              الخلفية.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {INVITATION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => patch({ invitationKind: opt.id })}
                  className={cn(
                    "rounded-2xl border p-5 text-start transition-all hover:border-th-lavender/40",
                    state.invitationKind === opt.id
                      ? "border-th-lavender/50 bg-th-royal/25 shadow-glow"
                      : "border-th-lavender/15 bg-th-deep/60",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-th-lavender-soft shrink-0" />
                    <span className="font-semibold text-th-cream">
                      {opt.title}
                    </span>
                  </div>
                  <p className="text-xs text-th-lavender/75 leading-relaxed">
                    {opt.description}
                  </p>
                  {state.invitationKind === opt.id && (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-300">
                      <Check className="h-3.5 w-3.5" /> تم الاختيار
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة ٣ */}
        {state.step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-th-lavender/15 pb-4">
              {(
                [
                  ["upload", "رفع صورة / فيديو"],
                  ["custom", "طلب نموذج مخصص"],
                  ["templates", "قوالب جاهزة"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      design: { ...p.design, sourceTab: id },
                    }))
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium border",
                    state.design.sourceTab === id
                      ? "bg-gradient-primary border-transparent text-th-cream"
                      : "border-th-lavender/20 text-th-lavender/80 hover:text-th-cream",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {state.design.sourceTab === "upload" && (
                  <div className="rounded-2xl border border-th-lavender/15 bg-th-deep/50 p-5 space-y-3">
                    <p className="text-sm font-semibold text-th-cream">
                      تحميل من جهازك
                    </p>
                    <p className="text-xs text-th-lavender/70">
                      يُحفظ اسم الملف محليًا للمعاينة؛ رفع السيرفر يُربط لاحقًا.
                    </p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setState((p) => ({
                          ...p,
                          design: {
                            ...p.design,
                            uploadedFileName: f?.name ?? null,
                          },
                        }));
                      }}
                      className="text-xs text-th-lavender/80 file:me-3 file:rounded-lg file:border-0 file:bg-th-royal/35 file:px-3 file:py-1.5 file:text-th-cream"
                    />
                    {state.design.uploadedFileName && (
                      <p className="text-xs text-emerald-300">
                        الملف: {state.design.uploadedFileName}
                      </p>
                    )}
                  </div>
                )}

                {state.design.sourceTab === "custom" && (
                  <div className="rounded-2xl border border-th-lavender/15 bg-th-deep/50 p-5 space-y-3">
                    <p className="text-sm font-semibold text-th-cream">
                      طلب يُنفَّذ لاحقًا كقالب مخصص
                    </p>
                    <textarea
                      value={state.design.customRequestNotes}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          design: {
                            ...p.design,
                            customRequestNotes: e.target.value,
                          },
                        }))
                      }
                      rows={5}
                      className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
                      placeholder="صفّي الألوان، النمط، المراجع، وأي ملاحظات للمصمم…"
                    />
                  </div>
                )}

                {state.design.sourceTab === "templates" && (
                  <>
                    <div>
                      <p className="text-xs text-th-lavender/65 mb-2">
                        تصنيفات القوالب
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              design: {
                                ...p.design,
                                templateCategoryFilter: null,
                              },
                            }))
                          }
                          className={cn(
                            "rounded-full px-3 py-1 text-xs border",
                            !state.design.templateCategoryFilter
                              ? "border-th-lavender/45 bg-th-royal/25 text-th-cream"
                              : "border-th-lavender/15 text-th-lavender/75",
                          )}
                        >
                          الكل
                        </button>
                        {TEMPLATE_CATEGORIES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              setState((p) => ({
                                ...p,
                                design: {
                                  ...p.design,
                                  templateCategoryFilter: c.id,
                                },
                              }))
                            }
                            className={cn(
                              "rounded-full px-3 py-1 text-xs border",
                              state.design.templateCategoryFilter === c.id
                                ? "border-th-lavender/45 bg-th-royal/25 text-th-cream"
                                : "border-th-lavender/15 text-th-lavender/75",
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-th-lavender/65 mb-2">
                        فلترة بالألوان
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              design: { ...p.design, colorFilter: null },
                            }))
                          }
                          className={cn(
                            "rounded-full px-3 py-1 text-xs border",
                            !state.design.colorFilter
                              ? "border-th-lavender/45 bg-th-royal/25 text-th-cream"
                              : "border-th-lavender/15 text-th-lavender/75",
                          )}
                        >
                          أي لون
                        </button>
                        {COLOR_FILTER_PRESETS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            title={c.label}
                            onClick={() =>
                              setState((p) => ({
                                ...p,
                                design: { ...p.design, colorFilter: c.id },
                              }))
                            }
                            className={cn(
                              "h-8 w-8 rounded-full border-2 transition-transform hover:scale-105",
                              state.design.colorFilter === c.id
                                ? "border-th-cream ring-2 ring-th-lavender/40"
                                : "border-th-lavender/25",
                            )}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-th-lavender/65 mb-2">
                        فلترة بالمناسبة
                      </p>
                      <select
                        value={state.design.occasionTemplateFilter}
                        onChange={(e) =>
                          setState((p) => ({
                            ...p,
                            design: {
                              ...p.design,
                              occasionTemplateFilter:
                                (e.target.value as OccasionTypeId | "") || "",
                            },
                          }))
                        }
                        className="w-full max-w-xs rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
                      >
                        <option value="">كل المناسبات</option>
                        {OCCASION_TYPE_OPTIONS.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-th-lavender/75">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.design.livePreviewEnabled}
                          onChange={(e) =>
                            setState((p) => ({
                              ...p,
                              design: {
                                ...p.design,
                                livePreviewEnabled: e.target.checked,
                              },
                            }))
                          }
                          className="rounded border-th-lavender/40"
                        />
                        معاينة مباشرة للتصميم
                      </label>
                    </div>

                    {state.design.compareIds.length > 0 && (
                      <p className="text-xs text-th-lavender/70">
                        مقارنة:{" "}
                        {state.design.compareIds
                          .map(
                            (id) =>
                              MOCK_TEMPLATES.find((t) => t.id === id)?.title,
                          )
                          .filter(Boolean)
                          .join(" ↔ ")}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-th-cream flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  المعاينة
                </p>
                <div
                  className={cn(
                    "rounded-2xl border border-th-lavender/20 overflow-hidden min-h-[240px] relative",
                    state.design.livePreviewEnabled ||
                      state.design.sourceTab !== "templates"
                      ? "opacity-100"
                      : "opacity-60",
                  )}
                  style={{
                    background: selectedTemplate
                      ? `linear-gradient(145deg, ${selectedTemplate.accentColors[0]}, ${selectedTemplate.accentColors[1] ?? "#1a1528"})`
                      : `linear-gradient(145deg, ${state.customization.primaryColor}, ${state.customization.secondaryColor})`,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <p
                      className="text-lg font-bold text-white drop-shadow-md px-2"
                      style={{
                        fontFamily:
                          state.customization.fontPreset === "modern"
                            ? "system-ui"
                            : "Georgia, serif",
                      }}
                    >
                      {previewHeadline}
                    </p>
                    <p className="mt-2 text-xs text-white/90 max-w-[90%]">
                      {previewBody}
                    </p>
                    {state.design.uploadedFileName &&
                      state.design.sourceTab === "upload" && (
                        <p className="mt-4 text-[10px] text-white/80 bg-black/25 px-2 py-1 rounded">
                          وسيط مرفوع: {state.design.uploadedFileName}
                        </p>
                      )}
                  </div>
                </div>

                {state.design.sourceTab === "templates" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pe-1">
                    {filteredTemplates.map((t) => (
                      <div
                        key={t.id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setState((p) => ({
                            ...p,
                            design: {
                              ...p.design,
                              selectedTemplateId: t.id,
                            },
                          }))
                        }
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.preventDefault();
                            setState((p) => ({
                              ...p,
                              design: {
                                ...p.design,
                                selectedTemplateId: t.id,
                              },
                            }));
                          }
                        }}
                        className={cn(
                          "rounded-xl border p-2 cursor-pointer transition-all text-start relative group",
                          state.design.selectedTemplateId === t.id
                            ? "border-th-cream ring-2 ring-th-lavender/40"
                            : "border-th-lavender/15 hover:border-th-lavender/35",
                        )}
                      >
                        <div
                          className="h-14 rounded-lg mb-1"
                          style={{
                            background: `linear-gradient(135deg, ${t.accentColors[0]}, ${t.accentColors[1]})`,
                          }}
                        />
                        <p className="text-[11px] font-medium text-th-cream truncate">
                          {t.title}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              toggleFavorite(t.id);
                            }}
                            className="p-1 rounded-md hover:bg-th-deep/80"
                            aria-label="مفضلة"
                          >
                            <Heart
                              className={cn(
                                "h-3.5 w-3.5",
                                state.design.favorites.includes(t.id)
                                  ? "fill-rose-400 text-rose-400"
                                  : "text-th-lavender/60",
                              )}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              toggleCompare(t.id);
                            }}
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded border",
                              state.design.compareIds.includes(t.id)
                                ? "border-th-cream text-th-cream"
                                : "border-th-lavender/25 text-th-lavender/70",
                            )}
                          >
                            مقارنة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* الخطوة ٤ */}
        {state.step === 4 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream flex items-center gap-2">
                  <Palette className="h-4 w-4" /> الخطوط
                </span>
                <select
                  value={state.customization.fontPreset}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        fontPreset: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
                >
                  {FONT_PRESETS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5 block">
                  <span className="text-xs text-th-lavender/75">
                    اللون الأساسي
                  </span>
                  <input
                    type="color"
                    value={state.customization.primaryColor}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        customization: {
                          ...p.customization,
                          primaryColor: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-th-lavender/20 bg-transparent cursor-pointer"
                  />
                </label>
                <label className="space-y-1.5 block">
                  <span className="text-xs text-th-lavender/75">
                    اللون الثانوي
                  </span>
                  <input
                    type="color"
                    value={state.customization.secondaryColor}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        customization: {
                          ...p.customization,
                          secondaryColor: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-th-lavender/20 bg-transparent cursor-pointer"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream">
                  رفع شعار (اختياري)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        logoFileName: f?.name ?? null,
                      },
                    }));
                  }}
                  className="text-xs text-th-lavender/80 file:me-2 file:rounded-lg file:bg-th-royal/30 file:px-2 file:py-1 file:text-th-cream file:border-0"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream">
                  صورة شخصية (اختياري)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        portraitFileName: f?.name ?? null,
                      },
                    }));
                  }}
                  className="text-xs text-th-lavender/80 file:me-2 file:rounded-lg file:bg-th-royal/30 file:px-2 file:py-1 file:text-th-cream file:border-0"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream">
                  إضافة فيديو (اختياري)
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        videoFileName: f?.name ?? null,
                      },
                    }));
                  }}
                  className="text-xs text-th-lavender/80 file:me-2 file:rounded-lg file:bg-th-royal/30 file:px-2 file:py-1 file:text-th-cream file:border-0"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream flex items-center gap-1">
                  <Music className="h-4 w-4" /> موسيقى خلفية (اختياري)
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        musicFileName: f?.name ?? null,
                      },
                    }));
                  }}
                  className="text-xs text-th-lavender/80 file:me-2 file:rounded-lg file:bg-th-royal/30 file:px-2 file:py-1 file:text-th-cream file:border-0"
                />
              </label>
            </div>

            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream">عنوان بارز</span>
                <input
                  type="text"
                  value={state.customization.headlineText}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        headlineText: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
                  placeholder="يظهر في أعلى الدعوة"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-th-cream">تعديل النصوص</span>
                <textarea
                  value={state.customization.bodyText}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      customization: {
                        ...p.customization,
                        bodyText: e.target.value,
                      },
                    }))
                  }
                  rows={5}
                  className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
                  placeholder="نص الدعوة الرئيسي…"
                />
              </label>

              <div className="flex flex-col gap-3 rounded-2xl border border-th-lavender/15 bg-th-deep/40 p-4">
                <label className="inline-flex items-center gap-2 text-sm text-th-cream cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.customization.countdownEnabled}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        customization: {
                          ...p.customization,
                          countdownEnabled: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-th-lavender/40"
                  />
                  إضافة عدّاد تنازلي للموعد
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-th-cream cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.customization.mapBlockEnabled}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        customization: {
                          ...p.customization,
                          mapBlockEnabled: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-th-lavender/40"
                  />
                  إظهار كتلة خريطة (من رابط الخرائط إن وُجد)
                </label>
              </div>

              <div className="rounded-2xl border border-th-lavender/15 p-4 bg-th-deep/35">
                <p className="text-xs text-th-lavender/70 mb-2">
                  تغيير الصور داخل القالب يتم عبر الرفع أعلاه أو من محرر الصور
                  لاحقًا بعد ربط الخلفية.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* الخطوة ٥ */}
        {state.step === 5 && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-sm font-semibold text-th-cream mb-3 flex items-center gap-2">
                  <TabletSmartphone className="h-4 w-4" />
                  نسخة الجوال
                </p>
                <div className="mx-auto w-[220px] rounded-[2rem] border-4 border-th-lavender/25 bg-th-deep/80 p-2 shadow-card-soft">
                  <div className="rounded-[1.5rem] overflow-hidden bg-black/40 aspect-[9/16] flex flex-col">
                    <div
                      className={cn(
                        "flex-1 flex flex-col justify-center px-4 py-6 text-center transition-transform",
                        motionPreviewOn && "animate-pulse",
                      )}
                      style={{
                        background: `linear-gradient(160deg, ${state.customization.primaryColor}, ${state.customization.secondaryColor})`,
                      }}
                    >
                      <p className="text-sm font-bold text-white">
                        {previewHeadline}
                      </p>
                      <p className="text-[10px] text-white/85 mt-2 leading-snug">
                        {previewBody}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !motionPreviewOn;
                    setMotionPreviewOn(next);
                    showToast(
                      next
                        ? "تشغيل معاينة الحركة (نبض خفيف)."
                        : "تم إيقاف معاينة الحركة.",
                    );
                  }}
                  className="mt-3 w-full rounded-xl border border-th-lavender/25 py-2 text-xs text-th-cream hover:bg-th-royal/20"
                >
                  اختبار الحركة
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-th-cream flex items-center gap-2">
                  <MonitorSmartphone className="h-4 w-4" />
                  سطح المكتب والاختبارات
                </p>
                <div
                  className="rounded-2xl border border-th-lavender/20 min-h-[160px] flex flex-col justify-center px-8 py-6 text-center"
                  style={{
                    background: `linear-gradient(120deg, ${state.customization.primaryColor}88, ${state.customization.secondaryColor}aa)`,
                  }}
                >
                  <p className="text-lg font-bold text-white">
                    {previewHeadline}
                  </p>
                  <p className="text-sm text-white/90 mt-2">{previewBody}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        state.customization.musicFileName
                          ? "معاينة صوتية وهمية — سيتم التشغيل الفعلي بعد الربط."
                          : "لم يُرفع ملف صوت بعد.",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-th-lavender/25 px-4 py-2 text-xs text-th-cream hover:bg-th-royal/20"
                  >
                    <Volume2 className="h-4 w-4" />
                    اختبار الصوت
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast("رابط تجريبي: سيُولَّد بعد النشر من الخادم.")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-th-lavender/25 px-4 py-2 text-xs text-th-cream hover:bg-th-royal/20"
                  >
                    تجربة فتح الرابط
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* الخطوة ٦ */}
        {state.step === 6 && (
          <div className="space-y-6">
            <p className="text-sm text-th-lavender/80 leading-relaxed">
              الخطوات النهائية قبل الربط بالخلفية: احفظي مسودة، انشري فورًا، أو
              جدّولي وقت النشر، ثم شاركي الرابط.
            </p>

            <label className="block max-w-md space-y-1.5">
              <span className="text-sm text-th-cream">جدولة النشر</span>
              <input
                type="datetime-local"
                value={state.publish.scheduledAt}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    publish: { ...p.publish, scheduledAt: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-th-lavender/20 bg-th-deep/80 px-3 py-2 text-sm text-th-cream"
              />
            </label>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  saveWizardDraft(state);
                  showToast("تم حفظ المسودة محليًا في المتصفح.");
                }}
                className="rounded-full border border-th-lavender/30 px-6 py-3 text-sm font-medium text-th-cream hover:bg-th-royal/20"
              >
                حفظ كمسودة
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "نشر الآن: يتطلّب API المناسبات — واجهة العميل جاهزة للربط.",
                  )
                }
                className="rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-th-cream hover:shadow-glow"
              >
                نشر الآن
              </button>
              <button
                type="button"
                disabled={!state.publish.scheduledAt}
                onClick={() =>
                  showToast(
                    state.publish.scheduledAt
                      ? `تم تسجيل الجدولة محليًا: ${state.publish.scheduledAt}`
                      : "",
                  )
                }
                className="rounded-full border border-th-lavender/30 px-6 py-3 text-sm font-medium text-th-cream hover:bg-th-royal/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                تأكيد الجدولة
              </button>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    "https://althuraya.example/preview/draft",
                  );
                  showToast("تم نسخ رابط مشاركة تجريبي.");
                }}
                className="rounded-full border border-th-lavender/30 px-6 py-3 text-sm font-medium text-th-cream hover:bg-th-royal/20"
              >
                مشاركة مباشرة (نسخ رابط)
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4 mt-10 pt-6 border-t border-th-lavender/15">
          <button
            type="button"
            onClick={goBack}
            disabled={state.step <= 1}
            className="inline-flex items-center gap-1 rounded-full border border-th-lavender/25 px-5 py-2.5 text-sm text-th-cream hover:bg-th-royal/15 disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
            رجوع
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={state.step >= 6 || !canGoNext(state.step)}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-th-cream hover:shadow-glow disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
