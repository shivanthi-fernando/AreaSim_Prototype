"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

/**
 * Primary UI button supporting multiple variants, sizes, loading state, and icon support.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-medium rounded-[10px] transition-all duration-200 focus-ring select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-light active:scale-[0.98] shadow-md hover:shadow-lg hover:-translate-y-0.5",
      secondary:
        "bg-surface-2 text-text hover:bg-border active:scale-[0.98] border border-border",
      ghost:
        "bg-transparent text-primary hover:bg-surface-2 active:scale-[0.98]",
      danger:
        "bg-accent-warm text-white hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg",
      outline:
        "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-sm px-3 py-1.5 h-8",
      md: "text-sm px-5 py-2.5 h-10",
      lg: "text-base px-7 py-3.5 h-12",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          icon && iconPosition === "left" && icon
        )}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);
Button.displayName = "Button";
