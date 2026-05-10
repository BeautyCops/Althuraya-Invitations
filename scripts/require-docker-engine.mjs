/**
 * قبل `docker compose` — يفسِّر رسالة خطأ «pipe dockerDesktopLinuxEngine» إن لم يكن Docker Desktop شغّالاً.
 */
import { spawnSync } from "node:child_process";

const r = spawnSync("docker", ["info"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (r.status === 0) process.exit(0);

console.error(`
[docker] محرّك Docker غير متاح.

على Windows:
  1) شغّلي تطبيق **Docker Desktop** من قائمة Start وانتظري حتى يصبح الخطّ أخضر (Engine running).
  2) أعيدوا التشغيل:  npm run db:bootstrap

إن لم تصبّبي Docker وتريد Postgres محلياً:
  ثبّتي PostgreSQL وتضعي DATABASE_URL المناسبة في ملف .env أو استعملي Postgres سحابي (Neon/Supabase…) وانسخي رابط الاتصال إلى .env ثم شغّلي:  npm run db:migrate
`);
process.exit(1);
