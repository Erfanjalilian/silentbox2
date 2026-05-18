import type { OrderStatus } from "@/types/dashboard";

export interface OrderRecord {
  id: string;
  userId: string;
  placedAt: string;
  totalToman: number;
  status: OrderStatus;
  itemsSummary: string;
}

const ordersData: OrderRecord[] = [];

function normalizeOrderId(rawId: string): string {
  return rawId.trim();
}

function createDeterministicOrders(userId: string): OrderRecord[] {
  const seed = Array.from(userId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const now = new Date();
  const orderDates = [0, -10, -25].map((daysAgo) => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysAgo);
    return date.toLocaleDateString("fa-IR");
  });

  return [
    {
      id: `${userId}-ORD-${1000 + ((seed + 17) % 9000)}`,
      userId,
      placedAt: orderDates[0],
      totalToman: 1_525_000 + (seed % 300_000),
      status: "delivered",
      itemsSummary: "کیف موبایل، محافظ صفحه نمایش",
    },
    {
      id: `${userId}-ORD-${2000 + ((seed + 31) % 8000)}`,
      userId,
      placedAt: orderDates[1],
      totalToman: 845_000 + (seed % 180_000),
      status: "shipped",
      itemsSummary: "شارژر سریع، کابل Type-C",
    },
    {
      id: `${userId}-ORD-${3000 + ((seed + 43) % 7000)}`,
      userId,
      placedAt: orderDates[2],
      totalToman: 375_000 + (seed % 120_000),
      status: "processing",
      itemsSummary: "کاور و لوازم جانبی",
    },
  ];
}

export function getAllOrders(): OrderRecord[] {
  return ordersData;
}

export function getOrdersByUser(userId: string): OrderRecord[] {
  const existing = ordersData.filter((order) => order.userId === userId);
  return existing;
}

export function getOrderById(orderId: string): OrderRecord | null {
  const normalized = normalizeOrderId(orderId);
  const order = ordersData.find((item) => item.id === normalized);
  return order ?? null;
}

export function addOrder(order: Omit<OrderRecord, "id">): OrderRecord {
  const nextId = `${order.userId}-ORD-${Date.now()}`;
  const newOrder: OrderRecord = {
    id: nextId,
    ...order,
  };
  ordersData.push(newOrder);
  return newOrder;
}

export function updateOrder(
  orderId: string,
  patch: Partial<Omit<OrderRecord, "id" | "userId">>,
): OrderRecord | null {
  const normalized = normalizeOrderId(orderId);
  const index = ordersData.findIndex((item) => item.id === normalized);
  if (index === -1) return null;
  const updated = {
    ...ordersData[index],
    ...patch,
  };
  ordersData[index] = updated;
  return updated;
}
