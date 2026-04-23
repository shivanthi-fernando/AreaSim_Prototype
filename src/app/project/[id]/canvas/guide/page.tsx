"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// ─── Per-step animated illustrations — UNCHANGED ──────────────────────────────

function IllustrationWelcome() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.rect x="30" y="20" width="260" height="145" rx="6"
        stroke="#1A7FA8" strokeWidth="2.5" fill="#EEF3F8"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }} />
      {[
        { d: "M 30 90 L 180 90" },
        { d: "M 180 20 L 180 90" },
        { d: "M 180 90 L 180 165" },
        { d: "M 180 90 L 290 90" },
      ].map((p, i) => (
        <motion.path key={i} d={p.d} stroke="#374151" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.2, repeat: Infinity, repeatDelay: 3 }} />
      ))}
      {[
        { x: 95, y: 52, text: "Meeting A" },
        { x: 230, y: 52, text: "Open Office" },
        { x: 95, y: 130, text: "Break Room" },
        { x: 230, y: 130, text: "Focus" },
      ].map((l, i) => (
        <motion.text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="10"
          fill="#1A7FA8" fontWeight="600"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 + i * 0.18, duration: 0.4, repeat: Infinity, repeatDelay: 2 }}>
          {l.text}
        </motion.text>
      ))}
      {[{ x: 60, y: 30 }, { x: 270, y: 25 }, { x: 155, y: 155 }].map((s, i) => (
        <motion.text key={i} x={s.x} y={s.y} textAnchor="middle" fontSize="12" fill="#00C9A7"
          animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: 2 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}>
          ✦
        </motion.text>
      ))}
    </svg>
  );
}

function IllustrationDrawRoom() {
  const points = [
    { x: 80, y: 130 }, { x: 80, y: 50 }, { x: 200, y: 50 }, { x: 240, y: 90 }, { x: 240, y: 130 },
  ];
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[80, 120, 160, 200, 240].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="165" stroke="#E5E7EB" strokeWidth="0.8" />
      ))}
      {[50, 90, 130, 165].map((y) => (
        <line key={y} x1="40" y1={y} x2="280" y2={y} stroke="#E5E7EB" strokeWidth="0.8" />
      ))}
      <motion.polygon
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        fill="rgba(10,79,110,0.12)" stroke="#0A4F6E" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }} />
      {points.map((pt, i) => {
        const next = points[(i + 1) % points.length];
        return (
          <motion.line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
            stroke="#0A4F6E" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.28, duration: 0.25, repeat: Infinity, repeatDelay: 2.5 }} />
        );
      })}
      {points.map((pt, i) => (
        <motion.circle key={i} cx={pt.x} cy={pt.y} r={i === 0 ? 6 : 4}
          fill={i === 0 ? "#00C9A7" : "#0A4F6E"} stroke="white" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.28, duration: 0.18, type: "spring", repeat: Infinity, repeatDelay: 2.5 }} />
      ))}
      <motion.g
        animate={{ x: [0, ...points.map(p => p.x - points[0].x)], y: [0, ...points.map(p => p.y - points[0].y)] }}
        initial={{ x: points[0].x - 10, y: points[0].y - 10 }}
        transition={{ duration: points.length * 0.28 + 0.3, times: [0, 0.15, 0.3, 0.5, 0.7, 0.9], ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}>
        <motion.path
          d="M 0 0 L 0 14 L 4 10 L 8 17 L 10 16 L 6 9 L 11 9 Z"
          fill="white" stroke="#374151" strokeWidth="1"
          style={{ transform: `translate(${points[0].x - 2}px, ${points[0].y - 2}px)` }} />
      </motion.g>
    </svg>
  );
}

function IllustrationNameCount() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="30" width="130" height="130" rx="6" fill="rgba(10,79,110,0.08)" stroke="#0A4F6E" strokeWidth="1.5" />
      <text x="105" y="100" textAnchor="middle" fontSize="10" fill="#0A4F6E" fontWeight="600">Conference A</text>
      <motion.rect x="140" y="45" width="158" height="110" rx="10"
        fill="white" stroke="#D0DDE6" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 4px 16px rgba(10,79,110,0.12))" }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring", repeat: Infinity, repeatDelay: 2.5 }} />
      <motion.rect x="152" y="72" width="134" height="22" rx="5"
        fill="#F7F9FC" stroke="#D0DDE6" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, repeat: Infinity, repeatDelay: 2.5 }} />
      <motion.text x="162" y="87" fontSize="9" fill="#374151"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, repeat: Infinity, repeatDelay: 2.5 }}>
        Conference A
      </motion.text>
      <motion.line x1="218" y1="76" x2="218" y2="90" stroke="#1A7FA8" strokeWidth="1.5"
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <motion.rect x="152" y="102" width="50" height="14" rx="7" fill="#BFDBFE"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, repeat: Infinity, repeatDelay: 2.5 }} />
      <motion.text x="177" y="113" textAnchor="middle" fontSize="8" fill="#1D4ED8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, repeat: Infinity, repeatDelay: 2.5 }}>
        Meeting
      </motion.text>
      <motion.rect x="152" y="126" width="134" height="22" rx="6" fill="#0A4F6E"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }} />
      <motion.text x="219" y="141" textAnchor="middle" fontSize="9" fill="white" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, repeat: Infinity, repeatDelay: 2.5 }}>
        Start Room Counting →
      </motion.text>
    </svg>
  );
}

function IllustrationGroupZones() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.rect x="50" y="35" width="95" height="110" rx="6" stroke="#374151" strokeWidth="1.5"
        animate={{ fill: ["rgba(10,79,110,0.08)", "rgba(0,201,167,0.2)", "rgba(10,79,110,0.08)"] }}
        transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatDelay: 1 }} />
      <text x="98" y="97" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">Conference A</text>
      <motion.rect x="175" y="35" width="95" height="110" rx="6" stroke="#374151" strokeWidth="1.5"
        animate={{ fill: ["rgba(10,79,110,0.08)", "rgba(0,201,167,0.2)", "rgba(10,79,110,0.08)"] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 1 }} />
      <text x="223" y="97" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">Conference B</text>
      <motion.rect x="35" y="22" width="250" height="136" rx="10"
        stroke="#00C9A7" strokeWidth="2" strokeDasharray="8 5" fill="transparent"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, repeat: Infinity, repeatDelay: 2 }} />
      <motion.rect x="100" y="14" width="120" height="18" rx="9" fill="#00C9A7"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.3, type: "spring", repeat: Infinity, repeatDelay: 2 }}
        style={{ transformOrigin: "160px 23px" }} />
      <motion.text x="160" y="26" textAnchor="middle" fontSize="9" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, repeat: Infinity, repeatDelay: 2 }}>
        Meeting Zone
      </motion.text>
    </svg>
  );
}

function IllustrationSingleZone() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="95" y="40" width="130" height="100" rx="6" stroke="#374151" strokeWidth="1.5" fill="rgba(10,79,110,0.08)" />
      <text x="160" y="95" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">Reception</text>
      <motion.rect x="78" y="26" width="164" height="128" rx="10"
        stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="7 5" fill="rgba(139,92,246,0.05)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }} />
      <motion.rect x="115" y="19" width="90" height="16" rx="8" fill="#8B5CF6"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", repeat: Infinity, repeatDelay: 2 }}
        style={{ transformOrigin: "160px 27px" }} />
      <motion.text x="160" y="30" textAnchor="middle" fontSize="8.5" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, repeat: Infinity, repeatDelay: 2 }}>
        Standalone Zone
      </motion.text>
      <motion.g
        animate={{ x: [0, 50, 100, 100, 0, 0], y: [0, 0, 0, 50, 50, 0] }}
        initial={{ x: 78, y: 154 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 0.5 }}>
        <circle cx="78" cy="154" r="5" fill="#8B5CF6" opacity="0.7" />
      </motion.g>
    </svg>
  );
}

// ─── Step definitions — UNCHANGED ─────────────────────────────────────────────
interface GuideStep {
  id: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
  illustrationBg: string;
}

const steps: GuideStep[] = [
  {
    id: 1,
    title: "Welcome to Your Canvas!",
    description: "We'll guide you step by step to create your first project. You'll learn how to mark rooms, group zones, and start counting — the core of AreaSim's workspace analysis.",
    illustration: <IllustrationWelcome />,
    illustrationBg: "bg-gradient-to-br from-[#EEF3F8] to-[#E0ECF5]",
  },
  {
    id: 2,
    title: "Mark Rooms with the Pen Tool",
    description: "Select the Draw Room tool in the floating toolbar. Click on the canvas to place polygon points — each click adds a corner. Double-click or click the first point to close the shape.",
    illustration: <IllustrationDrawRoom />,
    illustrationBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
  },
  {
    id: 3,
    title: "Name & Count Each Room",
    description: "Once you close a polygon, a modal appears. Give the room a name and category, set its seat capacity, then hit 'Start Room Counting' to go to the dedicated counting screen.",
    illustration: <IllustrationNameCount />,
    illustrationBg: "bg-gradient-to-br from-sky-50 to-blue-50",
  },
  {
    id: 4,
    title: "Group Rooms into Zones",
    description: "Select the Group tool, then click multiple room polygons to select them. A 'Group as Zone' bar appears — type a zone name and group them under a shared dashed boundary.",
    illustration: <IllustrationGroupZones />,
    illustrationBg: "bg-gradient-to-br from-teal-50 to-emerald-50",
  },
  {
    id: 5,
    title: "Single-Room Zones",
    description: "A single room can also be its own zone. Use the Zone Draw tool to mark a standalone area — ideal for reception desks, server rooms, or any space that stands alone.",
    illustration: <IllustrationSingleZone />,
    illustrationBg: "bg-gradient-to-br from-violet-50 to-purple-50",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CanvasGuidePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const goNext = () => {
    if (isLast) router.push(`/project/${projectId}/floor/floor-1`);
    else setStep((s) => s + 1);
  };
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const skip = () => router.push(`/project/${projectId}/floor/floor-1`);

  return (
    /* Full-screen overlay — canvas floor plan shows as blurred background */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">

      {/* ── Blurred canvas background ── */}
      <div className="absolute inset-0">
        {/* Floor plan image — fills screen, blurred */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mock/floorplan-oslo.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(6px) brightness(0.55) saturate(0.7)", transform: "scale(1.05)" }}
        />
        {/* Extra dark tint so modal stands out */}
        <div className="absolute inset-0 bg-[#0A1929]/60" />
      </div>

      {/* ── Modal card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="rounded-3xl border border-white/10 bg-white shadow-2xl overflow-hidden">

            {/* ── Modal header (inside card) ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5EAF0] bg-white">
              <Logo size="sm" />
              <div className="flex items-center gap-4">
                {/* Step dot progress */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => setStep(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-accent" : "w-2 bg-[#D0DDE6]"
                      }`} />
                  ))}
                </div>
                <span className="text-xs text-[#5C7A8A] font-body">{step + 1} / {steps.length}</span>
                <button onClick={skip}
                  className="flex items-center gap-1.5 text-sm text-[#5C7A8A] hover:text-[#0D1B2A] transition-colors font-body">
                  <X size={14} /> Skip
                </button>
              </div>
            </div>

            {/* ── Illustration area ── */}
            <div className={`${current.illustrationBg} border-b border-[#D0DDE6] relative overflow-hidden`}
              style={{ height: "200px" }}>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {current.illustration}
              </div>
              {/* Step badge */}
              <div className="absolute top-3 left-3 rounded-full bg-white/90 border border-[#D0DDE6] px-3 py-1 text-xs font-semibold text-[#5C7A8A] shadow-sm">
                Step {step + 1}
              </div>
            </div>

            {/* ── Content ── */}
            <div className="px-7 py-5">
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-2"
                style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                {current.title}
              </h2>
              <p className="text-sm text-[#5C7A8A] font-body leading-relaxed mb-5">
                {current.description}
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  {!isFirst && (
                    <button onClick={goPrev}
                      className="flex items-center gap-1.5 text-sm text-[#5C7A8A] hover:text-[#0D1B2A] transition-colors font-body">
                      <ChevronLeft size={15} /> Back
                    </button>
                  )}
                </div>

                {/* Mobile dots */}
                <div className="flex sm:hidden items-center gap-1.5">
                  {steps.map((_, i) => (
                    <div key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-5 bg-primary" : i < step ? "w-1.5 bg-accent" : "w-1.5 bg-[#D0DDE6]"
                      }`} />
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light text-white font-medium px-6 py-2.5 text-sm font-body transition-all hover:-translate-y-0.5 active:scale-95 shadow-md shadow-primary/25"
                >
                  {isLast ? "Start Annotating" : "Next"}
                  <ArrowRight size={15} />
                </motion.button>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
