/** للعمل خلف البروكسي (Railway وغيره): الطلب يصل غالبًا بـ http داخل الحاوية رغم أن الزائر على HTTPS. */
export function requestIsHttps(request: Request): boolean {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  const xf = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  return xf === "https";
}
