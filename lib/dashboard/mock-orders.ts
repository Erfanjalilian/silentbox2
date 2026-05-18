import type { MockOrder } from "@/types/dashboard";

/** Deterministic mock orders per user — replace with API later */
export function getMockOrders(userKey: string): MockOrder[] {
  const seed = userKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = [
    {
      id: `ORD-${1000 + (seed % 9000)}`,
      placedAt: "۱۴۰۴/۰۲/۱۲",
      totalToman: 2_450_000 + (seed % 500_000),
      status: "delivered" as const,
      itemsSummary: "فیلتر هوا، روغن موتور",
    },
    {
      id: `ORD-${2000 + (seed % 8000)}`,
      placedAt: "۱۴۰۴/۰۲/۲۸",
      totalToman: 890_000 + (seed % 200_000),
      status: "shipped" as const,
      itemsSummary: "کیت سرویس",
    },
    {
      id: `ORD-${3000 + (seed % 7000)}`,
      placedAt: "۱۴۰۴/۰۳/۰۵",
      totalToman: 410_000,
      status: "processing" as const,
      itemsSummary: "لنت ترمز جلو",
    },
  ];
  return base;
}
