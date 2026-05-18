import type { SessionPayload } from "@/types/auth";
import { AUTH_COOKIE_NAME, SESSION_MAX_AGE_SEC } from "./constants";
import { resolveRoleForPhone } from "./admin";
import type { NextRequest, NextResponse } from "next/server";

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET must be set to a strong string (min 16 chars). See .env.example.",
    );
  }
  return s;
}

function utf8Encode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  if (typeof atob !== "undefined") {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)!;
    return out;
  }
  return new Uint8Array(Buffer.from(b64, "base64"));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    utf8Encode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(secret: string, payloadJson: string): Promise<string> {
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    utf8Encode(payloadJson) as BufferSource,
  );
  return toBase64Url(new Uint8Array(sig));
}

async function verifySig(
  secret: string,
  payloadJson: string,
  sigB64url: string,
): Promise<boolean> {
  const key = await importHmacKey(secret);
  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    utf8Encode(payloadJson) as BufferSource,
  );
  const actual = fromBase64Url(sigB64url);
  if (actual.byteLength !== expected.byteLength) return false;
  let diff = 0;
  const exp = new Uint8Array(expected);
  for (let i = 0; i < actual.byteLength; i++) {
    diff |= actual[i]! ^ exp[i]!;
  }
  return diff === 0;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getSecret();
  const json = JSON.stringify(payload);
  const sig = await signPayload(secret, json);
  return `${toBase64Url(utf8Encode(json))}.${sig}`;
}

export async function parseSessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }
  const jsonBytes = fromBase64Url(payloadB64);
  const json = new TextDecoder().decode(jsonBytes);
  const ok = await verifySig(secret, json, sig);
  if (!ok) return null;
  try {
    const data = JSON.parse(json) as SessionPayload;
    if (typeof data.exp !== "number" || Date.now() / 1000 > data.exp) {
      return null;
    }
    if (!data.phone || !data.role || !data.sub) return null;
    return data;
  } catch {
    return null;
  }
}

export function buildSessionPayload(
  phone: string,
  profile: { firstName: string; lastName: string; email?: string },
): SessionPayload {
  const role = resolveRoleForPhone(phone);
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  return {
    sub: phone,
    phone,
    role,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    exp,
  };
}

export async function setAuthCookie(
  response: NextResponse,
  token: string,
): Promise<void> {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const raw = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return parseSessionToken(raw);
}
