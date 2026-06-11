"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function AdminLogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  const handleBackToSite = () => {
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBackToSite}
      className={
        compact
          ? "text-sm text-gray-400 hover:text-sky-400 transition-colors px-2"
          : "flex w-full items-center gap-3 rounded-lg p-3 text-gray-400 transition-colors hover:bg-sky-500/10 hover:text-sky-300"
      }
    >
      {!compact && <ArrowRightOnRectangleIcon className="h-5 w-5" />}
      <span>{compact ? "بازگشت" : "بازگشت به سایت"}</span>
    </button>
  );
}