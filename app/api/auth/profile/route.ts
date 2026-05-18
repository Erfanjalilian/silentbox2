import { NextRequest, NextResponse } from "next/server";
import {
  buildSessionPayload,
  createSessionToken,
  getSessionFromRequest,
  setAuthCookie,
} from "@/lib/auth/session";
import { upsertProfile } from "@/lib/auth/profile-store";
import { sessionToAuthUser } from "@/lib/auth/auth-user";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const firstName =
      typeof body.firstName === "string" ? body.firstName : undefined;
    const lastName = typeof body.lastName === "string" ? body.lastName : undefined;
    const email = typeof body.email === "string" ? body.email : undefined;

    const merged = upsertProfile(session.phone, {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(email !== undefined ? { email } : {}),
    });

    const payload = buildSessionPayload(session.phone, merged);
    const token = await createSessionToken(payload);

    const res = NextResponse.json({ ok: true, user: sessionToAuthUser(payload) });
    await setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error("auth/profile PATCH", e);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
