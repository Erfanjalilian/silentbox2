"use client";

import React, { useState } from "react";
import type { Order, OrderStatus } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/Button";
import { TextField } from "@/app/components/ui/TextField";

function statusLabel(s: OrderStatus): string {
  switch (s) {
    case "processing":
      return "در حال پردازش";
    case "shipped":
      return "ارسال شده";
    case "delivered":
      return "تحویل شده";
    case "cancelled":
      return "لغو شده";
    default:
      return s;
  }
}

function statusBadgeClass(s: OrderStatus): string {
  switch (s) {
    case "processing":
      return "bg-amber-500/15 text-amber-200 border-amber-500/30";
    case "shipped":
      return "bg-sky-500/15 text-sky-200 border-sky-500/30";
    case "delivered":
      return "bg-emerald-500/15 text-emerald-200 border-emerald-500/30";
    case "cancelled":
      return "bg-gray-600/40 text-gray-300 border-gray-500/30";
    default:
      return "bg-gray-700 text-gray-200";
  }
}

export default function DashboardClient() {
  const { user, refreshUser, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  React.useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    void (async () => {
      if (!cancelled) {
        setOrdersLoading(true);
        setOrdersError(null);
      }

      try {
        const res = await fetch("/api/orders", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setOrdersError(
            typeof data.error === "string"
              ? data.error
              : "خطا در بارگذاری سفارش‌ها",
          );
          return;
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch {
        if (!cancelled) {
          setOrdersError("ارتباط با سرور برقرار نشد.");
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const [profileDraft, setProfileDraft] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
  });

  React.useEffect(() => {
    void Promise.resolve().then(() => {
      setProfileDraft({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
      });
    });
  }, [user?.firstName, user?.lastName, user?.email]);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [phoneStep, setPhoneStep] = useState<"idle" | "sent">("idle");
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const saveProfile = async () => {
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          firstName: profileDraft.firstName,
          lastName: profileDraft.lastName,
          email: profileDraft.email || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProfileMsg(typeof data.error === "string" ? data.error : "خطا در ذخیره");
        return;
      }
      await refreshUser();
      setProfileMsg("ذخیره شد.");
    } catch {
      setProfileMsg("ارتباط با سرور برقرار نشد.");
    } finally {
      setProfileSaving(false);
    }
  };

  const sendPhoneOtp = async () => {
    setPhoneErr(null);
    setPhoneBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone: newPhone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPhoneErr(typeof data.error === "string" ? data.error : "خطا در ارسال کد");
        return;
      }
      setPhoneStep("sent");
    } catch {
      setPhoneErr("ارتباط با سرور برقرار نشد.");
    } finally {
      setPhoneBusy(false);
    }
  };

  const verifyPhoneChange = async () => {
    setPhoneErr(null);
    setPhoneBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          phone: newPhone,
          code: otpCode,
          intent: "change-phone",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPhoneErr(typeof data.error === "string" ? data.error : "کد نامعتبر است");
        return;
      }
      setNewPhone("");
      setOtpCode("");
      setPhoneStep("idle");
      await refreshUser();
    } catch {
      setPhoneErr("ارتباط با سرور برقرار نشد.");
    } finally {
      setPhoneBusy(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    const previousOrders = orders;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" } : o,
      ),
    );

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        throw new Error("failed");
      }
    } catch {
      setOrders(previousOrders);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100">پنل کاربری</h1>
          <p className="text-gray-400">
            اطلاعات شما و سفارش‌ها از API دریافت می‌شوند. وضعیت ورود تا زمان خروج در مرورگر ذخیره می‌شود.
          </p>
        </div>
        <Button variant="ghost" type="button" onClick={() => void logout()}>
          خروج از حساب
        </Button>
      </header>

      {/* Profile */}
      <section className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          اطلاعات پروفایل
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="نام"
            value={profileDraft.firstName}
            onChange={(e) =>
              setProfileDraft((p) => ({ ...p, firstName: e.target.value }))
            }
          />
          <TextField
            label="نام خانوادگی"
            value={profileDraft.lastName}
            onChange={(e) =>
              setProfileDraft((p) => ({ ...p, lastName: e.target.value }))
            }
          />
          <div className="md:col-span-2">
            <TextField
              label="ایمیل (اختیاری)"
              type="email"
              value={profileDraft.email}
              onChange={(e) =>
                setProfileDraft((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={saveProfile} isLoading={profileSaving}>
            ذخیرهٔ پروفایل
          </Button>
          {profileMsg && (
            <span className="text-sm text-emerald-300">{profileMsg}</span>
          )}
        </div>
        <dl className="mt-6 grid gap-3 rounded-xl border border-gray-700/80 bg-gray-950/40 p-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-gray-500">شماره موبایل فعلی</dt>
            <dd className="font-mono text-sky-300 ltr text-left">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-gray-500">نقش</dt>
            <dd className="text-gray-200">
              {user.role === "admin" ? "مدیر" : "کاربر"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Change phone */}
      <section className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-gray-100">
          تغییر شماره موبایل
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          شمارهٔ جدید را وارد کنید؛ پس از تأیید کد، نشست شما به‌روز می‌شود.
        </p>
        {phoneErr && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {phoneErr}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="شماره جدید"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            disabled={phoneBusy}
          />
          {phoneStep === "sent" && (
            <TextField
              label="کد تأیید"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              disabled={phoneBusy}
            />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {phoneStep === "idle" ? (
            <Button variant="secondary" onClick={sendPhoneOtp} isLoading={phoneBusy}>
              ارسال کد به شماره جدید
            </Button>
          ) : (
            <Button variant="primary" onClick={verifyPhoneChange} isLoading={phoneBusy}>
              تأیید و تغییر شماره
            </Button>
          )}
        </div>
      </section>

      {/* Orders */}
      <section className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">
              تاریخچه سفارش‌ها
            </h2>
          </div>
          {ordersLoading && (
            <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              در حال بارگذاری...
            </div>
          )}
        </div>
        {ordersError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {ordersError}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-700/80 bg-gray-950/30 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <div className="font-mono text-sky-300 ltr text-left">{o.id}</div>
                <div className="text-sm text-gray-400">{o.itemsSummary}</div>
                <div className="text-xs text-gray-500">
                  تاریخ: {o.placedAt} — مبلغ: {o.totalToman.toLocaleString("fa-IR")}{" "}
                  تومان
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${statusBadgeClass(
                    o.status,
                  )}`}
                >
                  {statusLabel(o.status)}
                </span>
                {o.status !== "cancelled" && o.status !== "delivered" && (
                  <Button
                    variant="danger"
                    className="!py-1.5 !px-3 text-xs"
                    onClick={() => cancelOrder(o.id)}
                  >
                    لغو سفارش
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
