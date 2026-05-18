const IR_MOBILE = /^09\d{9}$/;

/** Normalize Iranian mobile to `09xxxxxxxxx`. Returns null if invalid. */
export function normalizeIranMobile(input: string): string | null {
  const raw = input.trim().replace(/\s+/g, "");
  if (!raw) return null;

  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+98")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("0098")) {
    digits = "0" + digits.slice(4);
  } else if (digits.startsWith("98") && digits.length === 12) {
    digits = "0" + digits.slice(2);
  } else if (digits.length === 10 && digits.startsWith("9")) {
    digits = "0" + digits;
  }

  if (!IR_MOBILE.test(digits)) return null;
  return digits;
}

export function userIdFromPhone(phone: string): string {
  return `user_${phone}`;
}
