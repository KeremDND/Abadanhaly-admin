import crypto from "crypto";

const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(sessionId: string) {
  const secret = process.env.PREVIEW_SECRET || "dev-secret";
  const h = crypto.createHmac("sha256", secret);
  h.update(sessionId);
  return h.digest("hex");
}

export function validateCsrfToken(sessionId: string, token?: string | null) {
  if (!token) return false;
  const expected = generateCsrfToken(sessionId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export async function assertCsrf(req: Request, sessionId: string) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return;
  const token = (req.headers as any).get?.(CSRF_HEADER) || (req as any).headers?.[CSRF_HEADER];
  if (!validateCsrfToken(sessionId, token)) {
    throw new Error("Invalid CSRF token");
  }
}

export { CSRF_HEADER };
