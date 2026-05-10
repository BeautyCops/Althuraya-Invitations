import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { loadEnvLocal } from "./load-env-local.mjs";
loadEnvLocal();

/** يزامَن منطقيًا مع `src/lib/server/pg-options.ts` */
function dbHostFromUrl(databaseUrl) {
  const u = databaseUrl.trim();
  if (!u) return null;
  try {
    const hostname = new URL(
      u.replace(/^postgres(?:ql)?:/i, "http:"),
    ).hostname.replace(/^\[|\]$/g, "");
    return hostname || null;
  } catch {
    return null;
  }
}

function isLikelyPlaintextPgHost(hostname) {
  const h = hostname.toLowerCase();
  return (
    h.endsWith(".railway.internal") || h === "localhost" || h === "127.0.0.1"
  );
}

function postgresClientOpts(max, databaseUrl) {
  const url = databaseUrl?.trim() ?? "";
  const disable =
    process.env.DATABASE_SSL_DISABLE === "1" ||
    process.env.PGSSLMODE === "disable";
  const connectTimeout = Number(process.env.PGCONNECT_TIMEOUT ?? 25);
  const base = { max, connect_timeout: connectTimeout };
  let ssl = false;
  const host = dbHostFromUrl(url);
  if (disable) ssl = false;
  else if (process.env.NODE_ENV !== "production") ssl = false;
  else if (host && isLikelyPlaintextPgHost(host)) ssl = false;
  else ssl = { rejectUnauthorized: false };
  return { ...base, ssl };
}

const url = process.env.DATABASE_URL?.trim();
if (process.env.SKIP_DB_MIGRATE_ON_BOOT === "1") {
  console.warn(
    "[migrate] SKIP_DB_MIGRATE_ON_BOOT=1 — لا تستخدمين هذا في الإنتاج إلا للتشخيص القصير.",
  );
  process.exit(0);
}

if (url) {
  console.log("[migrate]", {
    NODE_ENV: process.env.NODE_ENV,
    dbHost: dbHostFromUrl(url) ?? "(غير محلّل)",
  });
}

if (!url) {
  if (process.env.NODE_ENV === "production") {
    console.error("[migrate] DATABASE_URL مطلوب في الإنتاج.");
    process.exit(1);
  }
  console.warn(
    "[migrate] DATABASE_URL غير معرّف — تخطّي الترحيلات (تطوير محلي).",
  );
  process.exit(0);
}

const client = postgres(url, postgresClientOpts(1, url));
const db = drizzle(client);

const migrateTimeoutMs = Number(process.env.MIGRATE_BOOT_TIMEOUT_MS ?? 120000);

function raceMigrate() {
  return Promise.race([
    migrate(db, { migrationsFolder: "./drizzle" }),
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(
          new Error(
            `[migrate] تجاوزت المهمة ${migrateTimeoutMs}ms — راجعي DATABASE_URL أو حددي MIGRATE_BOOT_TIMEOUT_MS`,
          ),
        );
      }, migrateTimeoutMs),
    ),
  ]);
}

let exitCode = 0;

try {
  await client`SELECT 1 AS ping`;
  console.log("[migrate] اتصلت بـ Postgres (ping OK).");
  await raceMigrate();
  console.log("[migrate] اكتملت الترحيلات.");
} catch (e) {
  console.error("[migrate] فشل:", e);
  exitCode = 1;
} finally {
  try {
    await client.end({ timeout: 10 });
  } catch {
    /* تجاهُل أخطاء الإغلاق — قد لا تكون قابلة لتدمير بعض المقابض فورًا */
  }
}

process.exit(exitCode);
