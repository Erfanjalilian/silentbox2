import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { sessionToAuthUser } from "@/lib/auth/auth-user";
import { getOrderById, updateOrder } from "@/lib/data/orders";
import type { OrderStatus } from "@/types/dashboard";

function isValidStatus(value: unknown): value is OrderStatus {
  return (
    value === "processing" ||
    value === "shipped" ||
    value === "delivered" ||
    value === "cancelled"
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
  }

  const user = sessionToAuthUser(session);
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
  }
  if (order.userId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "دسترسی به سفارش مورد نظر وجود ندارد." }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
  }

  const user = sessionToAuthUser(session);
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
  }
  if (order.userId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "دسترسی به سفارش مورد نظر وجود ندارد." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Partial<{ status: OrderStatus }> = {};
  if (typeof body.status === "string" && isValidStatus(body.status)) {
    patch.status = body.status;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: "هیچ تغییری ارسال نشده است." },
      { status: 400 },
    );
  }

  const updated = updateOrder(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "خطا در به‌روزرسانی سفارش." }, { status: 500 });
  }

  return NextResponse.json({ order: updated });
}
