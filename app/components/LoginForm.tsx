"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { TextField } from "@/app/components/ui/TextField";

type Phase = "idle" | "sent";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // مقدار پیش‌فرض: اگر redirect وجود داشت به آن، وگرنه به admin/products
  const redirectTo =
    searchParams.get("redirect")?.startsWith("/") === true
      ? searchParams.get("redirect")!
      : "/admin/products";

  const handleSendOtp = async () => {
    setError(null);
    setSuccess(null);
    setSendLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "خطا در ارسال کد");
        return;
      }
      setPhase("sent");
      if (process.env.NODE_ENV !== "production" && data._devOtp) {
        setSuccess(`کد تأیید ارسال شد (حالت توسعه: ${data._devOtp})`);
      } else {
        setSuccess("کد تأیید به شماره شما ارسال شد.");
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setSuccess(null);
    setVerifyLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "کد نامعتبر است");
        return;
      }

      // استفاده از redirectTo مستقیم - بدون نیاز به refreshUser
      const target =
        typeof data.redirectTo === "string" ? data.redirectTo : redirectTo;
      router.replace(target);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-700/80 bg-gray-900/60 p-8 shadow-2xl backdrop-blur">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-gray-50">ورود</h1>
            <p className="text-sm text-gray-400">
              شماره موبایل خود را وارد کنید تا دسترسی به حساب کاربری خود داشته باشید
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
              role="status"
            >
              ✓ {success}
            </div>
          )}

          {/* Phone Input Phase */}
          {phase === "idle" && (
            <div className="space-y-5">
              <TextField
                label="شماره موبایل"
                name="phone"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="numeric"
                disabled={sendLoading || verifyLoading}
              />

              <Button
                variant="primary"
                className="w-full py-3 text-base font-semibold"
                onClick={handleSendOtp}
                isLoading={sendLoading}
                disabled={verifyLoading || !phone.trim()}
              >
                ارسال کد تأیید
              </Button>
            </div>
          )}

          {/* OTP Verification Phase */}
          {phase === "sent" && (
            <div className="space-y-5 border-t border-gray-700/50 pt-6">
              <div className="space-y-2 text-center">
                <p className="text-sm text-gray-300">
                  کد تأیید به شماره <span className="font-mono font-semibold text-sky-300">{phone}</span> ارسال شد
                </p>
              </div>

              <TextField
                label="کد تأیید"
                name="otp"
                placeholder="۶ رقم"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                maxLength={12}
                disabled={verifyLoading}
                autoComplete="one-time-code"
              />

              <Button
                variant="primary"
                className="w-full py-3 text-base font-semibold"
                onClick={handleVerify}
                isLoading={verifyLoading}
                disabled={!code.trim()}
              >
                تأیید و ورود
              </Button>

              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  setError(null);
                  setSuccess(null);
                }}
                disabled={verifyLoading}
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800/50 disabled:opacity-50"
              >
                بازگشت
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}