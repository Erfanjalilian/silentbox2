import { createClient, RedisClientType } from "redis";
import { OTP_RESEND_COOLDOWN_SEC, OTP_VALIDITY_MINUTES } from "./constants";

const REDIS_URL = process.env.OTP_REDIS_URL?.trim() || process.env.REDIS_URL?.trim();

let redisClient: RedisClientType | null = null;
let redisConnected = false;
let redisConnectPromise: Promise<void> | null = null;

async function getRedisClient(): Promise<RedisClientType | null> {
  if (!REDIS_URL) return null;
  if (redisClient && redisConnected) return redisClient;
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on("error", (err: unknown) => {
      console.error("[otp-store] Redis error", err);
    });
  }
  if (!redisConnectPromise) {
    redisConnectPromise = redisClient.connect().then(() => {
      redisConnected = true;
    }).catch((err: unknown) => {
      console.error("[otp-store] Redis connect failed", err);
      redisClient = null;
      redisConnected = false;
      redisConnectPromise = null;
    });
  }
  await redisConnectPromise;
  return redisClient;
}

export interface OtpRecord {
  code: string;
  expiresAt: number;
}

const store = new Map<string, OtpRecord>();
const lastSentAt = new Map<string, number>();

function ttlToSeconds(ttl: number): number {
  if (ttl === null || ttl === undefined) return 0;
  return ttl > 0 ? ttl : 0;
}

export async function otpCooldownRemainingSec(phone: string): Promise<number> {
  const client = await getRedisClient();
  if (client) {
    const ttl = await client.ttl(`cooldown:${phone}`);
    return ttlToSeconds(ttl);
  }

  const t = lastSentAt.get(phone);
  if (!t) return 0;
  const elapsed = (Date.now() - t) / 1000;
  const left = OTP_RESEND_COOLDOWN_SEC - elapsed;
  return left > 0 ? Math.ceil(left) : 0;
}

export async function markOtpSent(phone: string): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.set(`cooldown:${phone}`, "1", {
      EX: OTP_RESEND_COOLDOWN_SEC,
    });
    return;
  }
  lastSentAt.set(phone, Date.now());
}

export async function saveOtp(phone: string, code: string): Promise<void> {
  const expiresAt = Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000;
  const client = await getRedisClient();
  if (client) {
    await client.set(`otp:${phone}`, code, {
      EX: OTP_VALIDITY_MINUTES * 60,
    });
    return;
  }
  store.set(phone, { code, expiresAt });
}

/** Remove pending OTP (e.g. after failed SMS send). */
export async function clearOtp(phone: string): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.del(`otp:${phone}`);
    return;
  }
  store.delete(phone);
}

export async function consumeOtp(phone: string, code: string): Promise<boolean> {
  const client = await getRedisClient();
  if (client) {
    const stored = await client.get(`otp:${phone}`);
    if (!stored) return false;
    if (stored !== code.trim()) return false;
    await client.del(`otp:${phone}`);
    return true;
  }

  const rec = store.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (rec.code !== code.trim()) return false;
  store.delete(phone);
  return true;
}
