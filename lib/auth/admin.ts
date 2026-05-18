import { ADMIN_PHONES } from "./constants";

export function resolveRoleForPhone(phone: string): "admin" | "user" {
  return ADMIN_PHONES.has(phone) ? "admin" : "user";
}
