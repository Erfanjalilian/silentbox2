"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { TextField } from "@/app/components/ui/TextField";

// This inner component uses useSearchParams and must be wrapped in Suspense
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear the redirect parameter from URL on component mount
  useEffect(() => {
    if (searchParams.get("redirect")) {
      // Replace current URL without the redirect parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password === "1383") {
      setLoading(true);
      // Navigate directly to admin products page
      router.push("/admin/products");
    } else {
      setError("رمز عبور اشتباه است");
      setPassword("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-700/80 bg-gray-900/60 p-8 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-gray-50">ورود به پنل مدیریت</h1>
        <p className="text-sm text-gray-400">
          برای دسترسی به پنل مدیریت، رمز عبور را وارد کنید
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

      {/* Password Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="رمز عبور"
          name="password"
          type="password"
          placeholder="رمز عبور را وارد کنید"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 text-base font-semibold"
          isLoading={loading}
          disabled={!password.trim() || loading}
        >
          ورود به پنل مدیریت
        </Button>
      </form>

      {/* Back to home link */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-sky-400 transition-colors"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}

// Loading fallback component for Suspense
function LoginFormFallback() {
  return (
    <div className="w-full max-w-md animate-pulse rounded-2xl border border-gray-700/80 bg-gray-900/60 p-8 shadow-2xl backdrop-blur">
      <div className="h-8 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 bg-gray-700 rounded mb-8"></div>
      <div className="h-10 bg-gray-700 rounded mb-4"></div>
      <div className="h-12 bg-gray-700 rounded"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginFormContent />
        </Suspense>
      </div>
    </main>
  );
}