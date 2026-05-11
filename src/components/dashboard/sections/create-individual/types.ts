/** خطوات المعالج (١–٦). */
export type WizardStepIndex = 1 | 2 | 3 | 4 | 5 | 6;

/** نوع المناسبة — المعرف للكود، التسمية للعرض. */
export type OccasionTypeId =
  | "wedding"
  | "henna"
  | "engagement"
  | "graduation"
  | "birthday"
  | "reception"
  | "other"
  | "private";

export const OCCASION_TYPE_OPTIONS: { id: OccasionTypeId; label: string }[] = [
  { id: "wedding", label: "زواج" },
  { id: "henna", label: "ملكة" },
  { id: "engagement", label: "خطوبة" },
  { id: "graduation", label: "تخرج" },
  { id: "birthday", label: "عيد ميلاد" },
  { id: "reception", label: "استقبال" },
  { id: "other", label: "اخرى" },
  { id: "private", label: "مناسبة خاصة" },
];

/** الخطوة ٢ — نوع الدعوة / الخدمة. */
export type InvitationProductKind = "design_only" | "qr_track" | "interactive";

/** مصدر التصميم في الخطوة ٣. */
export type DesignSourceTab = "upload" | "custom" | "templates";

export type TemplateCard = {
  id: string;
  title: string;
  categoryId: string;
  accentColors: string[];
  occasionTags: OccasionTypeId[];
};

export type WizardEventFields = {
  name: string;
  occasionType: OccasionTypeId | "";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  mapsUrl: string;
  description: string;
};

export type WizardDesignFields = {
  sourceTab: DesignSourceTab;
  uploadedFileName: string | null;
  customRequestNotes: string;
  selectedTemplateId: string | null;
  templateCategoryFilter: string | null;
  colorFilter: string | null;
  occasionTemplateFilter: OccasionTypeId | "";
  favorites: string[];
  compareIds: string[];
  livePreviewEnabled: boolean;
};

export type WizardCustomizationFields = {
  fontPreset: string;
  primaryColor: string;
  secondaryColor: string;
  logoFileName: string | null;
  portraitFileName: string | null;
  videoFileName: string | null;
  musicFileName: string | null;
  headlineText: string;
  bodyText: string;
  countdownEnabled: boolean;
  mapBlockEnabled: boolean;
};

export type WizardPublishFields = {
  scheduledAt: string;
};

export type IndividualOccasionWizardState = {
  step: WizardStepIndex;
  event: WizardEventFields;
  invitationKind: InvitationProductKind | "";
  design: WizardDesignFields;
  customization: WizardCustomizationFields;
  publish: WizardPublishFields;
};
