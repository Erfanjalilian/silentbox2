export interface ProfileRecord {
  firstName: string;
  lastName: string;
  email?: string;
}

const profiles = new Map<string, ProfileRecord>();

export function getProfile(phone: string): ProfileRecord {
  return (
    profiles.get(phone) ?? {
      firstName: "",
      lastName: "",
      email: "",
    }
  );
}

export function upsertProfile(phone: string, patch: Partial<ProfileRecord>): ProfileRecord {
  const prev = getProfile(phone);
  const next: ProfileRecord = {
    firstName: patch.firstName ?? prev.firstName,
    lastName: patch.lastName ?? prev.lastName,
    email: patch.email !== undefined ? patch.email : prev.email,
  };
  profiles.set(phone, next);
  return next;
}

export function migrateProfile(fromPhone: string, toPhone: string): void {
  const p = getProfile(fromPhone);
  profiles.set(toPhone, p);
  profiles.delete(fromPhone);
}
