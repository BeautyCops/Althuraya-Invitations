import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const SCRYPT_PARAMS = { N: 2 ** 16, r: 8, p: 1 } as const;
const KEYLEN = 64;

/** تنسيق مستقر للتوسع: v1$saltHex$hashHex */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEYLEN, SCRYPT_PARAMS);
  return `v1$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  try {
    const salt = Buffer.from(parts[1], "hex");
    const expected = Buffer.from(parts[2], "hex");
    if (expected.length !== KEYLEN) return false;
    const hash = scryptSync(plain, salt, KEYLEN, SCRYPT_PARAMS);
    return timingSafeEqual(hash, expected);
  } catch {
    return false;
  }
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function randomSessionToken(): string {
  return randomBytes(32).toString("hex");
}
