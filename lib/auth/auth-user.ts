import type { AuthUser, SessionPayload } from "@/types/auth";
import { userIdFromPhone } from "./phone";

export function sessionToAuthUser(session: SessionPayload): AuthUser {
  return {
    id: userIdFromPhone(session.phone),
    phone: session.phone,
    role: session.role,
    firstName: session.firstName ?? "",
    lastName: session.lastName ?? "",
    email: session.email || undefined,
  };
}
