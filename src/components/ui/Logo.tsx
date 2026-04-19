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
        <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
        {/* Floor plan grid */}
        <rect x="8" y="8" width="10" height="10" rx="1.5" fill="white" fillOpacity="0.9" />
        <rect x="22" y="8" width="10" height="10" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="8" y="22" width="10" height="10" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="22" y="22" width="10" height="10" rx="1.5" fill="white" fillOpacity="0.9" />
        {/* Center connector */}
        <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity="0.95" />
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
          Area<span style={{ color: "var(--color-accent)" }}>Sim</span>
        </span>
      )}
    </div>
  );
}
