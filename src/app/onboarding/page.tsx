"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Step1Project } from "@/components/onboarding/Step1Project";
import { Step3Lease } from "@/components/onboarding/Step3Lease";
import { Step3FloorPlans } from "@/components/onboarding/Step3FloorPlans";
import { Step6Done } from "@/components/onboarding/Step6Done";
import { useOnboardingStore } from "@/store/onboarding";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { label: "Create project", description: "Tell us about your project" },
  { label: "Add lease parameters",   description: "Add Lease parameters" },
  { label: "Add floor plans",  description: "Add floor plans" },
];

const stepMeta: Record<number, { title: string; subtitle: string; illuBg: string }> = {
  0: { title: "Create Your First Project",   subtitle: "Tell us about your building and location.",     illuBg: "from-blue-50 to-sky-100" },
  1: { title: "Add Lease Parameters",        subtitle: "Enter your area and cost details.",              illuBg: "from-amber-50 to-orange-100" },
  2: { title: "Add Floor Plans",             subtitle: "Upload and verify your floor plan layouts.",    illuBg: "from-indigo-50 to-blue-100" },
  3: { title: "Great you're all set!",       subtitle: "Your setup is complete.",                        illuBg: "from-green-50 to-teal-100" },
};

// ─── Step Illustrations ───────────────────────────────────────────────────────

function IlluStep1() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      <motion.rect x="85" y="70" width="130" height="140" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="2"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: "150px 210px" }} />
      {[{ x: 100, y: 90 }, { x: 135, y: 90 }, { x: 170, y: 90 },
        { x: 100, y: 125 }, { x: 135, y: 125 }, { x: 170, y: 125 },
        { x: 100, y: 160 }, { x: 135, y: 160 }, { x: 170, y: 160 }].map((w, i) => (
        <motion.rect key={i} x={w.x} y={w.y} width="22" height="20" rx="3"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.05 }} />
      ))}
      <motion.rect x="133" y="180" width="34" height="30" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      <motion.path d="M 75 72 L 150 28 L 225 72" stroke="#1A7FA8" strokeWidth="2.5" fill="none" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      <motion.rect x="60" y="12" width="180" height="24" rx="12" fill="#0A4F6E"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }} style={{ transformOrigin: "150px 24px" }} />
      <motion.text x="150" y="28" textAnchor="middle" fontSize="10" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Aker Brygge Tower
      </motion.text>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <circle cx="150" cy="234" r="10" fill="#0F7663" />
        <text x="150" y="252" textAnchor="middle" fontSize="8.5" fill="#64748B">Oslo, Norway</text>
      </motion.g>
    </svg>
  );
}

function IlluStep2() {
  const floors = ["Ground Floor", "1st Floor", "2nd Floor"];
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      {floors.map((name, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.18 + 0.1 }}>
          <rect x="50" y={185 - i * 56} width="200" height="44" rx="6"
            fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="56" y={190 - i * 56} width="26" height="14" rx="7"
            fill={["#DBEAFE", "#EDE9FE", "#DCFCE7"][i]} />
          <text x="69" y={200 - i * 56} textAnchor="middle" fontSize="7.5"
            fill={["#1D4ED8", "#7C3AED", "#15803D"][i]} fontWeight="700">
            {["G", "1F", "2F"][i]}
          </text>
          <text x="95" y={200 - i * 56} fontSize="9.5" fill="#374151" fontWeight="600">{name}</text>
          {[120, 145, 165, 185, 205].map((x, j) => (
            <rect key={j} x={x} y={192 - i * 56} width={16} height={10} rx="2"
              fill={["#EFF6FF", "#F5F3FF", "#F0FDF4"][i]} stroke="#E2E8F0" strokeWidth="0.8" />
          ))}
        </motion.g>
      ))}
      <motion.line x1="150" y1="73" x2="150" y2="182" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
      <motion.rect x="118" y="220" width="64" height="20" rx="10" fill="#1A7FA8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.text x="150" y="233" textAnchor="middle" fontSize="8.5" fill="white" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        + Add floors
      </motion.text>
    </svg>
  );
}

function IlluStep3() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      <rect x="30" y="30" width="240" height="195" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.06))" }} />
      <rect x="30" y="30" width="240" height="32" rx="12" fill="#F8FAFC" />
      <rect x="30" y="50" width="240" height="12" fill="#F8FAFC" />
      <text x="46" y="50" fontSize="9" fill="#94A3B8" fontWeight="600">LEASE OVERVIEW</text>
      {[
        { label: "Annual Rent",  value: "NOK 2,500,000", color: "#DBEAFE", text: "#1D4ED8", y: 75 },
        { label: "Total Area",   value: "10,000 SqFt",   color: "#DCFCE7", text: "#15803D", y: 113 },
        { label: "Common Area",  value: "NOK 400,000",   color: "#FEF9C3", text: "#854D0E", y: 151 },
        { label: "Headcount",    value: "120 people",    color: "#F3E8FF", text: "#7E22CE", y: 189 },
      ].map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}>
          <rect x="44" y={m.y} width={212} height={28} rx="6" fill={m.color} />
          <text x="54" y={m.y + 18} fontSize="9" fill="#374151">{m.label}</text>
          <text x="248" y={m.y + 18} textAnchor="end" fontSize="9.5" fill={m.text} fontWeight="700">{m.value}</text>
        </motion.g>
      ))}
      <motion.rect x="44" y="225" width="0" height="6" rx="3" fill="url(#leaseGrad)"
        animate={{ width: 180 }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }} />
      <defs>
        <linearGradient id="leaseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A7FA8" /><stop offset="100%" stopColor="#0F7663" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IlluStep4() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      <motion.rect x="50" y="30" width="200" height="140" rx="12"
        fill="white" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.rect x="70" y="50" width="160" height="100" rx="6" fill="#EFF6FF"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }} style={{ transformOrigin: "150px 100px" }} />
      {[
        { d: "M 90 70 L 190 70 L 190 140 L 90 140 Z" },
        { d: "M 130 70 L 130 140" },
        { d: "M 90 105 L 130 105" },
      ].map((p, i) => (
        <motion.path key={i} d={p.d} stroke="#93C5FD" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }} />
      ))}
      <motion.rect x="70" y="50" width="160" height="4" rx="2" fill="#0F7663" opacity="0.7"
        animate={{ y: [50, 144, 50] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <circle cx="150" cy="190" r="18" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      </motion.g>
      <motion.text x="150" y="222" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Drop your floor plan here
      </motion.text>
      <motion.text x="150" y="238" textAnchor="middle" fontSize="8.5" fill="#94A3B8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        PNG · JPG · SVG · PDF supported
      </motion.text>
      <motion.rect x="108" y="244" width="84" height="14" rx="7" fill="#0A4F6E"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      <motion.text x="150" y="254" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        ✦ AI analyses your plan
      </motion.text>
    </svg>
  );
}

function IlluStep5() {
  const rooms = [
    { name: "Conference A", x: 70,  y: 55,  w: 80, h: 55, verified: true },
    { name: "Open Office",  x: 158, y: 55,  w: 80, h: 55, verified: true },
    { name: "Break Room",   x: 70,  y: 118, w: 80, h: 55, verified: false },
    { name: "Reception",    x: 158, y: 118, w: 80, h: 55, verified: false },
  ];
  return (
    <svg viewBox="0 0 300 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-56">
      {rooms.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.1 }}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="5"
            fill={r.verified ? "#F0FDF4" : "#F8FAFC"} stroke={r.verified ? "#86EFAC" : "#E2E8F0"} strokeWidth="1.5" />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 4} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">
            {r.name}
          </text>
          {r.verified && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 + 0.5, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${r.x + r.w - 12}px ${r.y + 12}px` }}>
              <circle cx={r.x + r.w - 12} cy={r.y + 12} r="8" fill="#22C55E" />
              <text x={r.x + r.w - 12} y={r.y + 15.5} textAnchor="middle" fontSize="9" fill="white">✓</text>
            </motion.g>
          )}
          {!r.verified && <circle cx={r.x + r.w - 12} cy={r.y + 12} r="8" fill="#E2E8F0" />}
        </motion.g>
      ))}
      <line x1="70" y1="108" x2="238" y2="108" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <circle cx="84" cy="195" r="6" fill="#22C55E" />
        <text x="93" y="199" fontSize="8.5" fill="#374151">Verified from floor plan</text>
        <circle cx="176" cy="195" r="6" fill="#E2E8F0" />
        <text x="185" y="199" fontSize="8.5" fill="#374151">Pending</text>
      </motion.g>
    </svg>
  );
}

function IlluStep6() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      {[
        { x: 60,  y: 50,  color: "#60A5FA", size: 8 },
        { x: 100, y: 35,  color: "#34D399", size: 6 },
        { x: 180, y: 40,  color: "#F59E0B", size: 7 },
        { x: 230, y: 60,  color: "#A78BFA", size: 9 },
        { x: 240, y: 120, color: "#F472B6", size: 6 },
        { x: 55,  y: 140, color: "#34D399", size: 8 },
        { x: 80,  y: 200, color: "#60A5FA", size: 5 },
        { x: 210, y: 200, color: "#F59E0B", size: 7 },
        { x: 250, y: 170, color: "#A78BFA", size: 6 },
      ].map((p, i) => (
        <motion.rect key={i} x={p.x} y={p.y} width={p.size} height={p.size} rx={p.size / 3} fill={p.color}
          animate={{ y: [p.y, p.y + 12, p.y], rotate: [0, 180, 360], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }} />
      ))}
      <motion.circle cx="150" cy="120" r="60" fill="white" stroke="#D1FAE5" strokeWidth="2.5"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,201,167,0.2))" }}
        animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="150" y="145" textAnchor="middle" fontSize="11" fill="#0D1B2A" fontWeight="800">Setup Complete!</text>
      {["Map Rooms", "Count Occupants", "Analyse & Report"].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.18 }}>
          <rect x="76" y={198 + i * 18} width="148" height="14" rx="7"
            fill={["#DBEAFE", "#D1FAE5", "#FEF9C3"][i]} />
          <text x="150" y={208 + i * 18} textAnchor="middle" fontSize="8" fontWeight="600"
            fill={["#1D4ED8", "#15803D", "#854D0E"][i]}>
            {i + 1}. {s}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = [
  <IlluStep1 key={0} />,
  <IlluStep3 key={1} />, // Lease illustration for Step 2
  null,                  // No illustration for Step 3
  <IlluStep6 key={3} />, // Done illustration for Step 4
];

const slideVariants = {
  enterRight: { opacity: 0, x: 32 },
  center:     { opacity: 1, x: 0 },
  exitLeft:   { opacity: 0, x: -32 },
  enterLeft:  { opacity: 0, x: -32 },
  exitRight:  { opacity: 0, x: 32 },
};

export default function OnboardingPage() {
  const { currentStep, nextStep, prevStep, setStep } = useOnboardingStore();
  const isLastStep = currentStep === 3;
  const isStep3 = currentStep === 2; // Add Floor Plans step
  const meta = stepMeta[currentStep];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-border bg-surface">
        <Logo size="sm" />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl space-y-7">
          {/* Step indicator */}
          {!isLastStep && <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setStep} />}

          {/* Split card */}
          <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
            <div className={`grid grid-cols-1 ${isLastStep || isStep3 ? "" : "lg:grid-cols-2"}`}>

              {/* ── Left: form ────────────────────────────────────────── */}
              <div className={`flex flex-col ${isLastStep || isStep3 ? "" : "border-b lg:border-b-0 lg:border-r border-border"}`}>
                {/* Step header */}
                {!isLastStep && (
                  <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-text-muted font-mono uppercase tracking-widest mb-1">
                          Step {currentStep + 1} of {STEPS.length}
                        </p>
                        <h1 className="text-xl sm:text-2xl font-700 text-text"
                          style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                          {meta.title}
                        </h1>
                        <p className="text-sm text-text-muted font-body mt-1">{meta.subtitle}</p>
                      </div>
                      {isStep3 && (
                        <Button 
                          variant="secondary" 
                          size="lg" 
                          className="h-10 text-xs border-primary text-primary hover:bg-primary/5"
                        >
                          Don’t have a floor plan
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Form content */}
                <div className="px-6 sm:px-8 py-7 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      variants={slideVariants}
                      initial="enterRight"
                      animate="center"
                      exit="exitLeft"
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {currentStep === 0 && <Step1Project onNext={nextStep} />}
                      {currentStep === 1 && <Step3Lease onNext={nextStep} onBack={prevStep} />}
                      {currentStep === 2 && <Step3FloorPlans onNext={nextStep} onBack={prevStep} />}
                      {currentStep === 3 && <Step6Done />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Right: illustration (hidden on last step and step 3) ────────── */}
              <div className={`${isLastStep || isStep3 ? "hidden" : "hidden lg:flex"} items-center justify-center bg-gradient-to-br ${meta.illuBg} px-8 py-10 min-h-[420px]`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full max-w-xs"
                  >
                    {ILLUSTRATIONS[currentStep]}

                    {/* Step label pill */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-5 text-center"
                    >
                      <span className="inline-block rounded-full bg-white/70 border border-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-text/70 font-body">
                        {meta.subtitle}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Progress dots (mobile only) */}
          <div className="lg:hidden flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-primary" : i < currentStep ? "w-2 bg-accent" : "w-2 bg-border"
                }`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
