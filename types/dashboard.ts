export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  placedAt: string;
  totalToman: number;
  status: OrderStatus;
  itemsSummary: string;
}

export type MockOrder = Omit<Order, "userId">;

export interface ReturnRequestDraft {
  orderId: string;
  reason: string;
}
