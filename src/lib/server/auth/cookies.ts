export const SESSION_COOKIE_NAME = "althuraya_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 يومًا

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (!name) continue;
    out[name] = decodeURIComponent(rest.join("=").trim());
  }
  return out;
}

export function serializeCookie(options: {
  name: string;
  value: string;
  maxAgeSec: number;
  secure: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
}): string {
  const {
    name,
    value,
    maxAgeSec,
    secure,
    httpOnly = true,
    sameSite = "lax",
    path = "/",
  } = options;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAgeSec}`,
    `SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`,
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookieHeader(secure: boolean): string {
  return serializeCookie({
    name: SESSION_COOKIE_NAME,
    value: "",
    maxAgeSec: 0,
    secure,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}
