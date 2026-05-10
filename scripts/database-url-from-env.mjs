/**
 * ترتيب متوافق مع Railway Postgres غالبًا: لا يوفّر `DATABASE_URL`
 * على الخدمة تلقائيًا بينما يوفّر `DATABASE_PUBLIC_URL` / `DATABASE_PRIVATE_URL`.
 *
 * يزامن منطقيًا مع `databaseUrlFromEnv` في `src/lib/server/pg-options.ts`.
 */
export function databaseUrlFromEnv() {
  const u =
    process.env.DATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL ||
    process.env.DATABASE_PUBLIC_URL;
  return typeof u === "string" ? u.trim() : "";
}
