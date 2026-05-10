import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function getKey(): Buffer | null {
  const raw = process.env.DATA_ENCRYPTION_KEY?.trim();
  if (!raw) return null;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  try {
    return Buffer.from(raw, "base64");
  } catch {
    return null;
  }
}

function assertKey(key: Buffer): void {
  if (key.length !== 32) {
    throw new Error(
      "DATA_ENCRYPTION_KEY يجب أن يمثل 32 بايتاً (hex 64 حرفاً أو base64).",
    );
  }
}

/** تشفير نص حساس للتخزين (AES-256-GCM). بدون مفتاح لا يُستخدم. */
export function encryptOptionalPlaintext(plain: string): string | null {
  const key = getKey();
  if (!key) return null;
  assertKey(key);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decryptToPlaintext(blob: string): string {
  const key = getKey();
  if (!key) {
    throw new Error("تعذر فك التشفير: DATA_ENCRYPTION_KEY غير معرّف.");
  }
  assertKey(key);
  const buf = Buffer.from(blob, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8",
  );
}

export function hasEncryptionKey(): boolean {
  return Boolean(getKey());
}
