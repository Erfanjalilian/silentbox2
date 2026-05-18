import { OTP_RESEND_COOLDOWN_SEC, OTP_VALIDITY_MINUTES } from "./constants";

export interface OtpRecord {
  code: string;
  expiresAt: number;
}

const store = new Map<string, OtpRecord>();
const lastSentAt = new Map<string, number>();

export function otpCooldownRemainingSec(phone: string): number {
  const t = lastSentAt.get(phone);
  if (!t) return 0;
  const elapsed = (Date.now() - t) / 1000;
  const left = OTP_RESEND_COOLDOWN_SEC - elapsed;
  return left > 0 ? Math.ceil(left) : 0;
}

export function markOtpSent(phone: string): void {
  lastSentAt.set(phone, Date.now());
}

export function saveOtp(phone: string, code: string): void {
  const expiresAt = Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000;
  store.set(phone, { code, expiresAt });
}

/** Remove pending OTP (e.g. after failed SMS send). */
export function clearOtp(phone: string): void {
  store.delete(phone);
}

export function consumeOtp(phone: string, code: string): boolean {
  const rec = store.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (rec.code !== code.trim()) return false;
  store.delete(phone);
  return true;
}
