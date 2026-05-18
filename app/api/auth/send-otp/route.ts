import { NextResponse } from "next/server";
import { normalizeIranMobile } from "@/lib/auth/phone";
import {
  clearOtp,
  markOtpSent,
  otpCooldownRemainingSec,
  saveOtp,
} from "@/lib/auth/otp-store";
import { sendSmsIrVerifyCode } from "@/lib/services/sms-ir";

function randomOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const DEFAULT_SMS_IR_VERIFY_TEMPLATE_ID = 368405;

function parseTemplateId(): number | null {
  const raw = process.env.SMS_IR_VERIFY_TEMPLATE_ID?.trim();
  if (!raw) return DEFAULT_SMS_IR_VERIFY_TEMPLATE_ID;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.SMS_IR_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "پیکربندی سرور ناقص است: متغیر محیطی SMS_IR_API_KEY تنظیم نشده است.",
        },
        { status: 500 },
      );
    }

    const templateId = parseTemplateId();
    if (templateId === null) {
      console.error(
        "[send-otp] Missing or invalid SMS_IR_VERIFY_TEMPLATE_ID",
      );
      return NextResponse.json(
        {
          error:
            "پیکربندی سرور ناقص است: شناسه قالب تأیید (SMS_IR_VERIFY_TEMPLATE_ID) تنظیم نشده یا نامعتبر است.",
        },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawPhone = typeof body.phone === "string" ? body.phone : "";
    const phone = normalizeIranMobile(rawPhone);

    if (!phone) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر وارد کنید (۱۱ رقم، با ۰۹)." },
        { status: 400 },
      );
    }

    const cool = otpCooldownRemainingSec(phone);
    if (cool > 0) {
      return NextResponse.json(
        { error: `لطفاً ${cool} ثانیه دیگر دوباره تلاش کنید.` },
        { status: 429 },
      );
    }

    const code = randomOtp();
    saveOtp(phone, code);

    const codeParameterName =
      process.env.SMS_IR_VERIFY_CODE_PARAM?.trim() || "Code";

    const sms = await sendSmsIrVerifyCode({
      normalizedPhone09: phone,
      code,
      apiKey,
      templateId,
      codeParameterName,
    });

    if (!sms.ok) {
      clearOtp(phone);

      const upstream =
        sms.providerMessage?.trim() ||
        sms.rawBodySnippet?.slice(0, 120) ||
        "بدون جزئیات";

      console.error("[send-otp] SMS.ir failure", {
        kind: sms.kind,
        httpStatus: sms.httpStatus,
        providerStatus: sms.providerStatus,
        providerMessage: sms.providerMessage,
        snippet: sms.rawBodySnippet?.slice(0, 400),
      });

      const devPayload =
        process.env.NODE_ENV !== "production"
          ? {
              debug: {
                kind: sms.kind,
                httpStatus: sms.httpStatus,
                providerStatus: sms.providerStatus,
                providerMessage: sms.providerMessage,
                snippet: sms.rawBodySnippet,
              },
            }
          : {};

      // Transport / parsing problems — gateway-style failures
      if (sms.kind === "network") {
        return NextResponse.json(
          {
            error:
              "ارتباط با سرویس پیامک برقرار نشد. اتصال اینترنت سرور یا دسترسی به api.sms.ir را بررسی کنید.",
            ...devPayload,
          },
          { status: 503 },
        );
      }

      if (sms.kind === "parse_error") {
        return NextResponse.json(
          {
            error: "پاسخ غیرمنتظره از سرویس پیامک دریافت شد.",
            ...devPayload,
          },
          { status: 502 },
        );
      }

      if (sms.kind === "http_error" && sms.httpStatus >= 500) {
        return NextResponse.json(
          {
            error:
              "سرویس پیامک موقتاً در دسترس نیست. بعداً تلاش کنید.",
            ...devPayload,
          },
          { status: 502 },
        );
      }

      // 4xx from SMS.ir or logical rejection (status !== 1)
      return NextResponse.json(
        {
          error: "ارسال پیامک ناموفق بود. بعداً تلاش کنید.",
          detail: upstream,
          ...devPayload,
        },
        { status: 422 },
      );
    }

    markOtpSent(phone);

    return NextResponse.json({
      ok: true,
      message: "کد تأیید ارسال شد.",
      ...(process.env.NODE_ENV !== "production"
        ? { _devOtp: code }
        : {}),
    });
  } catch (e) {
    console.error("[send-otp] Unhandled error", e);
    return NextResponse.json(
      { error: "خطای سرور در ارسال کد." },
      { status: 500 },
    );
  }
}
