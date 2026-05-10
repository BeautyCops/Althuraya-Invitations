import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL?.trim();
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

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] اكتملت الترحيلات.");
} catch (e) {
  console.error("[migrate] فشل:", e);
  process.exit(1);
} finally {
  await client.end({ timeout: 10 });
}
