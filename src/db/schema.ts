import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** أدوار قابلة للتوسع لاحقًا (صلاحيات، فرق، …) */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 512 }).notNull(),
    /** اختياري؛ إن وُجد DATA_ENCRYPTION_KEY يُخزَّن نص مشفَّر */
    displayNameEncrypted: text("display_name_encrypted"),
    role: userRoleEnum("role").notNull().default("user"),
    /** حقول مرنة للتوسع دون ترحيلات متكررة */
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("users_email_idx").on(t.email)],
);

/**
 * جلسات غير شفّافة مخزّنة بالخادم: مناسبة لإبطال فوري ولعدة نُسخ خلف Load balancer.
 * لاحقًا يمكن استبدال التخزين بـ Redis مع نفس الواجهة.
 */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** SHA-256 لهيكس لرمز الجلسة الظاهر في الكوكي فقط */
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
  },
  (t) => [
    index("sessions_token_hash_idx").on(t.tokenHash),
    index("sessions_user_id_idx").on(t.userId),
    index("sessions_expires_at_idx").on(t.expiresAt),
  ],
);
