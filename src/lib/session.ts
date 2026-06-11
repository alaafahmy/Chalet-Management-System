/**
 * نظام الجلسات المؤمَّن باستخدام HMAC-SHA256
 * يوقّع بيانات الجلسة لمنع التزوير
 */

import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "fallback-secret-change-me";

export function signSession(data: object): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string): object | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;

    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");

    if (expected !== sig) return null; // توقيع غير صالح

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}
