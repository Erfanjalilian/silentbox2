export const AUTH_COOKIE_NAME = "silencer_session";

/** Seconds — session lifetime */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

/** Admin mobile numbers (normalized `09…`) */
export const ADMIN_PHONES = new Set<string>([
  "09213570389",
  "09124541307",
]);

/** OTP validity (minutes) — aligned with SMS.ir tokenInfo.validity */
export const OTP_VALIDITY_MINUTES = 5;

/** Minimum seconds between OTP sends per phone */
export const OTP_RESEND_COOLDOWN_SEC = 60;
