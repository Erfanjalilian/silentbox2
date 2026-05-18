import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { sessionToAuthUser } from "@/lib/auth/auth-user";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user: sessionToAuthUser(session) });
  } catch (e) {
    console.error("auth/me", e);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
