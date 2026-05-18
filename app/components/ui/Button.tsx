"use client";

import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sky-600 hover:bg-sky-500 text-white shadow-sm disabled:opacity-50",
  secondary:
    "bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 disabled:opacity-50",
  danger:
    "bg-red-600 hover:bg-red-500 text-white disabled:opacity-50",
  ghost:
    "bg-transparent hover:bg-gray-800 text-sky-400 border border-gray-600 disabled:opacity-50",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  className = "",
  disabled,
  isLoading,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          در حال انجام…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
