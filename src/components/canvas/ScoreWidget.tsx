"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Building, Package, ClipboardList } from "lucide-react";
import { useCanvasStore } from "@/store/canvas";

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);
  return <span>{displayed}</span>;
}

/* Tiny blueprint grid illustration rendered in SVG */
function BlueprintAccent() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]"
      viewBox="0 0 160 48"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* grid dots */}
      {[16, 32, 48, 64, 80, 96, 112, 128, 144].map((x) =>
        [12, 24, 36].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#0A4F6E" />
        ))
      )}
      {/* blueprint lines */}
      <line x1="0" y1="24" x2="160" y2="24" stroke="#0A4F6E" strokeWidth="0.5" strokeDasharray="4 4" />
      <line x1="80" y1="0" x2="80" y2="48" stroke="#0A4F6E" strokeWidth="0.5" strokeDasharray="4 4" />
      {/* tiny room outline */}
      <rect x="20" y="8" width="22" height="16" rx="2" stroke="#0A4F6E" strokeWidth="0.8" fill="none" />
      <rect x="56" y="8" width="14" height="16" rx="2" stroke="#0A4F6E" strokeWidth="0.8" fill="none" />
      <rect x="104" y="8" width="30" height="16" rx="2" stroke="#0A4F6E" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

export function ScoreWidget() {
  const { surveyResponses, getActiveFloor } = useCanvasStore();
  const floor = getActiveFloor();
  const roomCount = floor?.rooms.length ?? 0;
  const zoneCount = floor?.zones.length ?? 0;

  const stats = [
    { icon: <Building size={12} />, label: "Rooms",  value: roomCount },
    { icon: <Package size={12} />,  label: "Zones",  value: zoneCount },
    { icon: <ClipboardList size={12} />, label: "Survey", value: surveyResponses },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-stretch rounded-xl border border-primary/20 bg-white/90 backdrop-blur-sm shadow-md shadow-primary/10 overflow-hidden"
    >
      {/* Decorative blueprint background */}
      <BlueprintAccent />

      {stats.map(({ icon, label, value }, i) => (
        <div
          key={label}
          className={`relative z-10 flex items-center gap-2.5 px-4 py-2.5 ${
            i < stats.length - 1 ? "border-r border-primary/10" : ""
          }`}
        >
          {/* Circle with animated number — LEFT */}
          <motion.div
            className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm"
            animate={{
              boxShadow: [
                "0 0 0px rgba(10,79,110,0)",
                "0 0 10px rgba(10,79,110,0.35)",
                "0 0 0px rgba(10,79,110,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            <span
              className="text-[11px] font-bold text-white tabular-nums leading-none"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              <AnimatedNumber value={value} />
            </span>
          </motion.div>

          {/* Icon + label stacked vertically — RIGHT */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-primary/70">{icon}</span>
            <span className="text-[9px] text-primary/60 font-body uppercase tracking-widest leading-none whitespace-nowrap font-semibold">
              {label}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
