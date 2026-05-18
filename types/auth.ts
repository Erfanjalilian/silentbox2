export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface SessionPayload {
  sub: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email?: string;
  exp: number;
}
