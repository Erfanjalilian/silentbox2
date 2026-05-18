import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { sessionToAuthUser } from "@/lib/auth/auth-user";
import { addOrder, getOrderById, getOrdersByUser } from "@/lib/data/orders";
import type { OrderStatus } from "@/types/dashboard";

function isValidStatus(value: unknown): value is OrderStatus {
  return (
    value === "processing" ||
    value === "shipped" ||
    value === "delivered" ||
    value === "cancelled"
  );
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
  }

  const user = sessionToAuthUser(session);
  const userId = request.nextUrl.searchParams.get("userId");
  const orderId = request.nextUrl.searchParams.get("id");

  if (orderId) {
    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
    }
    if (order.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی به سفارش مورد نظر وجود ندارد." }, { status: 403 });
    }
    return NextResponse.json({ order });
  }

  const lookupUserId = userId ?? user.id;
  if (userId && lookupUserId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "دسترسی به سفارش‌های این کاربر وجود ندارد." }, { status: 403 });
  }

  const orders = getOrdersByUser(lookupUserId);
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "نیاز به ورود دارید." }, { status: 401 });
  }

  const user = sessionToAuthUser(session);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const requestedUserId = typeof body.userId === "string" ? body.userId : user.id;
  if (requestedUserId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "امکان ایجاد سفارش برای این کاربر وجود ندارد." }, { status: 403 });
  }

  const itemsSummary = typeof body.itemsSummary === "string" ? body.itemsSummary : "سفارش جدید";
  const placedAt = typeof body.placedAt === "string" ? body.placedAt : new Date().toLocaleDateString("fa-IR");
  const totalToman = typeof body.totalToman === "number" ? body.totalToman : 0;
  const status = typeof body.status === "string" && isValidStatus(body.status) ? body.status : "processing";

  const newOrder = addOrder({
    userId: requestedUserId,
    placedAt,
    totalToman,
    status,
    itemsSummary,
  });

  return NextResponse.json({ order: newOrder }, { status: 201 });
}
