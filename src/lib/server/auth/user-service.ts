import { eq } from "drizzle-orm";

import { getDb } from "@/db/index";
import { users } from "@/db/schema";
import { encryptOptionalPlaintext } from "@/lib/server/crypto-at-rest";
import { effectivePublicRole } from "@/lib/auth/super-admin";
import { hashPassword, verifyPassword } from "@/lib/server/auth/password";

export async function createUser(input: {
  email: string;
  password: string;
  displayName?: string;
}) {
  const db = getDb();
  const email = input.email.toLowerCase();
  const passwordHash = hashPassword(input.password);
  let displayNameEncrypted: string | null = null;
  if (input.displayName) {
    displayNameEncrypted = encryptOptionalPlaintext(input.displayName);
    if (!displayNameEncrypted) {
      displayNameEncrypted = null;
    }
  }

  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayNameEncrypted: displayNameEncrypted ?? undefined,
      metadata: {},
    })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
    });

  if (!row) throw new Error("فشل إنشاء المستخدم.");
  return {
    ...row,
    role: effectivePublicRole(row.email),
  };
}

export async function verifyUserCredentials(email: string, password: string) {
  const db = getDb();
  const normalized = email.toLowerCase();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (!row) return null;
  if (!verifyPassword(password, row.passwordHash)) return null;

  return {
    id: row.id,
    email: row.email,
    role: effectivePublicRole(row.email),
  };
}
