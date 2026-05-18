import React, { Suspense } from "react";
import LoginForm from "@/app/components/LoginForm";

function LoginFallback() {
  return (
    <div className="mx-auto max-w-md animate-pulse rounded-2xl border border-gray-700 bg-gray-900/40 p-10" />
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
