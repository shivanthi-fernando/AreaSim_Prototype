import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent shrink-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Floating floor-plan shapes */}
        <div className="absolute top-1/4 left-12 w-32 h-32 border-2 border-white/20 rounded-2xl" />
        <div className="absolute top-1/4 left-20 w-16 h-48 border-2 border-white/15 rounded-2xl translate-x-32" />
        <div className="absolute bottom-1/4 right-12 w-48 h-24 border-2 border-white/20 rounded-2xl" />
        <div className="absolute bottom-1/3 right-20 w-20 h-20 border-2 border-white/15 rounded-full" />

        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          <Logo size="md" showText className="[&_span]:text-white" />

          <div className="flex-1 flex flex-col justify-center">
            <p className="text-5xl font-800 text-white leading-tight mb-4" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
              Workspace
              <br />
              Intelligence,
              <br />
              Reimagined.
            </p>
            <p className="text-white/70 text-base font-body leading-relaxed max-w-sm">
              Join hundreds of Norwegian organisations using AreaSim to optimise
              their workspace and cut real estate costs.
            </p>
          </div>

        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border lg:border-0">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="ml-auto">
            <LanguageSelector />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
