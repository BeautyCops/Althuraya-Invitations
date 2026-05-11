import type { IndividualOccasionWizardState, TemplateCard } from "./types";

export const WIZARD_STORAGE_KEY = "althuraya_individual_occasion_wizard_v1";

export const TEMPLATE_CATEGORIES: { id: string; label: string }[] = [
  { id: "classic", label: "كلاسيكي" },
  { id: "minimal", label: "بسيط" },
  { id: "luxury", label: "فاخر" },
  { id: "floral", label: "زهور" },
  { id: "geometric", label: "هندسي" },
];

/** قوالب تجريبية للمعاينة والفلترة (بدون أصول حقيقية بعد). */
export const MOCK_TEMPLATES: TemplateCard[] = [
  {
    id: "t1",
    title: "ذهبي ملكي",
    categoryId: "luxury",
    accentColors: ["#c9a227", "#1a1528"],
    occasionTags: ["wedding", "henna"],
  },
  {
    id: "t2",
    title: "ورد ناعم",
    categoryId: "floral",
    accentColors: ["#e8b4bc", "#f5f0eb"],
    occasionTags: ["engagement", "birthday"],
  },
  {
    id: "t3",
    title: "خط عصري",
    categoryId: "minimal",
    accentColors: ["#2d3142", "#ffffff"],
    occasionTags: ["graduation", "reception"],
  },
  {
    id: "t4",
    title: "سهرة ليلية",
    categoryId: "geometric",
    accentColors: ["#0f172a", "#38bdf8"],
    occasionTags: ["private", "other"],
  },
  {
    id: "t5",
    title: "دعوة بسيطة",
    categoryId: "minimal",
    accentColors: ["#44403c", "#fafaf9"],
    occasionTags: ["reception", "wedding"],
  },
  {
    id: "t6",
    title: "فرح وتخرج",
    categoryId: "classic",
    accentColors: ["#14532d", "#fef9c3"],
    occasionTags: ["graduation", "birthday"],
  },
];

export const COLOR_FILTER_PRESETS: {
  id: string;
  label: string;
  hex: string;
}[] = [
  { id: "gold", label: "ذهبي", hex: "#c9a227" },
  { id: "rose", label: "وردي", hex: "#e8b4bc" },
  { id: "navy", label: "كحلي", hex: "#1e3a5f" },
  { id: "sage", label: "زيتوني", hex: "#84a98c" },
  { id: "ivory", label: "عاجي", hex: "#f5f0eb" },
  { id: "black", label: "أسود", hex: "#1c1917" },
];

export const FONT_PRESETS: { id: string; label: string }[] = [
  { id: "system", label: "افتراضي النظام" },
  { id: "elegant", label: "خط أنيق" },
  { id: "modern", label: "خط حديث" },
  { id: "traditional", label: "خط تقليدي" },
];

export function createInitialWizardState(): IndividualOccasionWizardState {
  return {
    step: 1,
    event: {
      name: "",
      occasionType: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      mapsUrl: "",
      description: "",
    },
    invitationKind: "",
    design: {
      sourceTab: "templates",
      uploadedFileName: null,
      customRequestNotes: "",
      selectedTemplateId: null,
      templateCategoryFilter: null,
      colorFilter: null,
      occasionTemplateFilter: "",
      favorites: [],
      compareIds: [],
      livePreviewEnabled: true,
    },
    customization: {
      fontPreset: "elegant",
      primaryColor: "#c9a227",
      secondaryColor: "#1a1528",
      logoFileName: null,
      portraitFileName: null,
      videoFileName: null,
      musicFileName: null,
      headlineText: "",
      bodyText: "",
      countdownEnabled: false,
      mapBlockEnabled: true,
    },
    publish: {
      scheduledAt: "",
    },
  };
}

export function loadWizardDraft(): IndividualOccasionWizardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IndividualOccasionWizardState;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      !parsed.event ||
      !parsed.design ||
      !parsed.customization ||
      !parsed.publish
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWizardDraft(state: IndividualOccasionWizardState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* تجاهل امتلاء التخزين */
  }
}

export function clearWizardDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WIZARD_STORAGE_KEY);
}
