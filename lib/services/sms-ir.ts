/**
 * SMS.ir REST API — verification template send (OTP-style).
 * Docs: https://apidocs.sms.ir/ — POST /v1/send/verify
 */

export const SMS_IR_VERIFY_URL = "https://api.sms.ir/v1/send/verify";

/** SMS.ir expects mobile without leading 0 (e.g. 9123456789). */
export function toSmsIrMobile(normalizedIran09: string): string {
  if (normalizedIran09.startsWith("0")) {
    return normalizedIran09.slice(1);
  }
  return normalizedIran09;
}

export type SmsIrSendErrorKind =
  | "success"
  | "network"
  | "parse_error"
  | "http_error"
  | "business_rejected";

export interface SmsIrVerifySendResult {
  ok: boolean;
  kind: SmsIrSendErrorKind;
  httpStatus: number;
  /** SMS.ir JSON `status` — documentation uses `1` for success */
  providerStatus?: number;
  providerMessage?: string;
  messageId?: number;
  rawBodySnippet?: string;
}

interface SmsIrJsonBody {
  status?: number;
  message?: string;
  data?: { messageId?: number; cost?: number };
}

function maskMobile(m: string): string {
  if (m.length < 7) return "***";
  return `${m.slice(0, 4)}***${m.slice(-3)}`;
}

export async function sendSmsIrVerifyCode(params: {
  normalizedPhone09: string;
  code: string;
  apiKey: string;
  templateId: number;
  /** Must match the placeholder name in your SMS.ir template (often `Code`). */
  codeParameterName?: string;
}): Promise<SmsIrVerifySendResult> {
  const mobile = toSmsIrMobile(params.normalizedPhone09);
  const codeParameterName = params.codeParameterName?.trim() || "Code";

  const payload = {
    mobile,
    templateId: params.templateId,
    parameters: [{ name: codeParameterName, value: params.code }],
  };

  console.info("[sms-ir] POST /v1/send/verify", {
    mobile: maskMobile(mobile),
    templateId: params.templateId,
    codeParam: codeParameterName,
  });

  try {
    const res = await fetch(SMS_IR_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": params.apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();
    const preview = text.slice(0, 800);

    let json: SmsIrJsonBody | null = null;
    try {
      json = JSON.parse(text) as SmsIrJsonBody;
    } catch {
      console.error("[sms-ir] Non-JSON response", {
        httpStatus: res.status,
        preview,
      });
      return {
        ok: false,
        kind: "parse_error",
        httpStatus: res.status,
        rawBodySnippet: preview,
        providerMessage: text.trim().slice(0, 200) || undefined,
      };
    }

    console.info("[sms-ir] Response", {
      httpStatus: res.status,
      providerStatus: json.status,
      providerMessage: json.message,
      messageId: json.data?.messageId,
      bodyPreview: preview,
    });

    const businessOk = json.status === 1;
    const ok = res.ok && businessOk;

    if (ok) {
      return {
        ok: true,
        kind: "success",
        httpStatus: res.status,
        providerStatus: json.status,
        providerMessage: json.message,
        messageId: json.data?.messageId,
        rawBodySnippet: preview,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        kind: "http_error",
        httpStatus: res.status,
        providerStatus: json.status,
        providerMessage: json.message,
        rawBodySnippet: preview,
      };
    }

    return {
      ok: false,
      kind: "business_rejected",
      httpStatus: res.status,
      providerStatus: json.status,
      providerMessage: json.message,
      rawBodySnippet: preview,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[sms-ir] Fetch failed", { error: msg });
    return {
      ok: false,
      kind: "network",
      httpStatus: 0,
      providerMessage: msg,
    };
  }
}
