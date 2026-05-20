import { NextRequest, NextResponse } from "next/server";
import { normalizeIranMobile } from "@/lib/auth/phone";
import { consumeOtp } from "@/lib/auth/otp-store";
import {
  buildSessionPayload,
  createSessionToken,
  getSessionFromRequest,
  setAuthCookie,
} from "@/lib/auth/session";
import { getProfile, migrateProfile } from "@/lib/auth/profile-store";
import { sessionToAuthUser } from "@/lib/auth/auth-user";

type Intent = "login" | "change-phone";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawPhone = typeof body.phone === "string" ? body.phone : "";
    const code = typeof body.code === "string" ? body.code : "";
    const intent = (body.intent as Intent) ?? "login";

    const phone = normalizeIranMobile(rawPhone);
    if (!phone || !code.trim()) {
      return NextResponse.json(
        { error: "شماره و کد تأیید را وارد کنید." },
        { status: 400 },
      );
    }

    if (!(await consumeOtp(phone, code))) {
      return NextResponse.json(
        { error: "کد نامعتبر یا منقضی شده است." },
        { status: 401 },
      );
    }

    if (intent === "change-phone") {
      const session = await getSessionFromRequest(request);
      if (!session) {
        return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
      }

      const oldPhone = session.phone;
      if (oldPhone === phone) {
        return NextResponse.json(
          { error: "شماره جدید با شماره فعلی یکسان است." },
          { status: 400 },
        );
      }

      migrateProfile(oldPhone, phone);

      const prof = getProfile(phone);
      const payload = buildSessionPayload(phone, prof);
      const token = await createSessionToken(payload);

      const redirectTo = payload.role === 'admin' ? '/admin/users' : '/dashboard';
      const res = NextResponse.json({
        ok: true,
        redirectTo,
        user: sessionToAuthUser(payload),
      });
      await setAuthCookie(res, token);
      return res;
    }

    const prof = getProfile(phone);
    const payload = buildSessionPayload(phone, prof);
    const token = await createSessionToken(payload);

    const redirectTo =
      payload.role === "admin" ? "/admin/users" : "/dashboard";

    const res = NextResponse.json({
      ok: true,
      redirectTo,
      user: sessionToAuthUser(payload),
    });
    await setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error("verify-otp", e);
    return NextResponse.json(
      { error: "خطای سرور در تأیید کد." },
      { status: 500 },
    );
  }
}
