"use client";

import React from "react";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  hint,
  error,
  className = "",
  id,
  ...rest
}: TextFieldProps) {
  const inputId = id ?? rest.name ?? label.replace(/\s+/g, "-");
  return (
    <label className="block w-full" htmlFor={inputId}>
      <span className="mb-1.5 block text-sm font-medium text-gray-300">
        {label}
      </span>
      <input
        id={inputId}
        className={`w-full rounded-lg border bg-gray-900/80 px-3 py-2.5 text-gray-100 outline-none ring-sky-500/40 placeholder:text-gray-500 focus:ring-2 ${
          error
            ? "border-red-500/70 focus:ring-red-500/40"
            : "border-gray-600 focus:border-sky-500"
        } ${className}`}
        dir="ltr"
        {...rest}
      />
      {hint && !error && (
        <span className="mt-1 block text-xs text-gray-500">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      )}
    </label>
  );
}
