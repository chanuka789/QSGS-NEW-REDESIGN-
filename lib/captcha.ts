import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Human verification without a third-party service (proof of work, ALTCHA-style).
 * The server issues a signed puzzle: find the number n (0 … max) for which
 * sha256(salt + n) equals `challenge`. A browser solves it in about a second; a bot
 * sending thousands of forms has to pay that cost for every single one.
 * Each solution is accepted once and only before the puzzle expires.
 */
const MAX_NUMBER = 120_000;
const TTL_MS = 20 * 60 * 1000;

// Signing key: CAPTCHA_SECRET if set, otherwise a random key for this server process.
const SECRET = process.env.CAPTCHA_SECRET || randomBytes(32).toString("hex");
const used = new Map<string, number>();

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const sign = (s: string) => createHmac("sha256", SECRET).update(s).digest("hex");

export type Challenge = { algorithm: "SHA-256"; salt: string; challenge: string; maxnumber: number; signature: string };
export type Solution = { salt: string; number: number; challenge: string; signature: string };

export function createChallenge(): Challenge {
  const salt = `${randomBytes(12).toString("hex")}.${Date.now() + TTL_MS}`;
  const n = Math.floor(Math.random() * MAX_NUMBER);
  const challenge = sha256(salt + n);
  return { algorithm: "SHA-256", salt, challenge, maxnumber: MAX_NUMBER, signature: sign(challenge) };
}

/** Verifies a base64 JSON solution from the form. Returns false for anything invalid or reused. */
export function verifySolution(payload: unknown): boolean {
  if (process.env.CAPTCHA_DISABLED === "true") return true;
  if (typeof payload !== "string" || payload.length > 2000) return false;
  let s: Solution;
  try {
    s = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return false;
  }
  if (!s || typeof s.salt !== "string" || typeof s.challenge !== "string" || typeof s.signature !== "string" || !Number.isInteger(s.number)) return false;
  const expires = Number(s.salt.split(".")[1]);
  if (!expires || expires < Date.now()) return false;
  const expected = Buffer.from(sign(s.challenge), "hex");
  const given = Buffer.from(s.signature, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  if (sha256(s.salt + s.number) !== s.challenge) return false;
  // One use per puzzle.
  const now = Date.now();
  for (const [k, exp] of used) if (exp < now) used.delete(k);
  if (used.has(s.challenge)) return false;
  used.set(s.challenge, expires);
  return true;
}
