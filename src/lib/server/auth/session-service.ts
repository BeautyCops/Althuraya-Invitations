import { and, eq, gt } from "drizzle-orm";

import { getDb } from "@/db/index";
import { sessions, users } from "@/db/schema";

import { randomSessionToken, sha256Hex } from "@/lib/server/auth/password";
import {
  SESSION_MAX_AGE_SEC,
  SESSION_COOKIE_NAME,
  parseCookies,
  serializeCookie,
} from "@/lib/server/auth/cookies";
import { requestIsHttps } from "@/lib/server/auth/request-is-https";

export type PublicUser = {
  id: string;
  email: string;
  role: "user" | "admin";
};

function secureFromRequest(request: Request) {
  return requestIsHttps(request);
}

export async function createSessionForUser(
  request: Request,
  userId: string,
): Promise<{ setCookie: string; token: string }> {
  const db = getDb();
  const token = randomSessionToken();
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  const userAgent = request.headers.get("user-agent");

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
    ip: ip ?? undefined,
    userAgent: userAgent ?? undefined,
  });

  const secure = secureFromRequest(request);
  const setCookie = serializeCookie({
    name: SESSION_COOKIE_NAME,
    value: token,
    maxAgeSec: SESSION_MAX_AGE_SEC,
    secure,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return { setCookie, token };
}

export async function getSessionUserFromRequest(
  request: Request,
): Promise<PublicUser | null> {
  const cookies = parseCookies(request.headers.get("cookie"));
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token || token.length < 16) return null;

  const tokenHash = sha256Hex(token);
  const db = getDb();
  const now = new Date();

  const rows = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  await db
    .update(sessions)
    .set({ lastUsedAt: now })
    .where(eq(sessions.id, row.session.id));

  return {
    id: row.user.id,
    email: row.user.email,
    role: row.user.role,
  };
}

export async function revokeSessionByRequest(request: Request): Promise<void> {
  const cookies = parseCookies(request.headers.get("cookie"));
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return;
  const tokenHash = sha256Hex(token);
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}
