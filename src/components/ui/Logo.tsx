import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

/** AreaSim SVG logo with optional wordmark. */
export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-base" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 44, text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Icon mark — stylised A with grid overlay */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill="url(#logo-gradient)" />
        <g transform="translate(5, 6) scale(0.297)">
          <path d="M47.5 2.59998L11.2 63.5H17.4L4.6 85.7H6.3H6.6H7.3H13.3L22.6 69.1H20.6L12.3 84H7.6L19.4 63.5H66L65.2 61.8H20.4L47.4 14.9L87 84H72.6L74 81.2H82.2L50.9 26.9L50.1 28.9L79.2 79.5H72.9L69.8 85.7H90L47.4 11.4L18.4 61.8H14.3L47.5 5.99997L94.8 88.6H7.3H5H3L2 90.3H97.8L47.5 2.59998Z" fill="white" />
        </g>
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0A4F6E" />
            <stop offset="1" stopColor="#00C9A7" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span
          className={cn(
            "font-display font-700 tracking-tight text-text",
            s.text
          )}
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}
        >
          Area<span style={{ color: "var(--color-accent-text)" }}>Sim</span>
        </span>
      )}
    </div>
  );
}
