import preview from "@/assets/og-share-preview.png?url";

/** صورة المعاينة عند مشاركة الرابط (واتساب، إكس، إلخ). */
export const SHARE_PREVIEW_IMAGE_HREF = preview;

/** يبني رابطًا مطلقًا لـ og:image عند تعيين `VITE_SITE_URL`. */
export function absoluteSharePreviewImage(): string {
  const origin = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  const path = preview.startsWith("/") ? preview : `/${preview}`;
  if (!origin) return path;
  return `${origin}${path}`;
}
