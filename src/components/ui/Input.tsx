"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
}

/**
 * Styled input with label, error state, hint text, and optional icon.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      onIconClick,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text font-body"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted",
                onIconClick && "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={onIconClick}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 text-sm text-text font-body",
              "placeholder:text-text-muted/60",
              "transition-all duration-200",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              "hover:border-primary/50",
              error && "border-accent-warm focus:border-accent-warm focus:ring-accent-warm/20",
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-text-muted",
                onIconClick && "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={onIconClick}
            >
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-accent-warm font-body">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted font-body">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
