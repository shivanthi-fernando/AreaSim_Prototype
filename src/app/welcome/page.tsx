"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

// ─── Animated SVG: Before (clipboard with messy lines + clock) ─────────────────

function ClipboardIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Clipboard body */}
      <motion.rect
        x="30" y="44" width="140" height="148" rx="8"
        fill="#FEF9C3" stroke="#D97706" strokeWidth="2"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      {/* Clipboard header bar */}
      <motion.rect
        x="30" y="34" width="140" height="22" rx="6"
        fill="#F59E0B" stroke="#D97706" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Clip on top */}
      <motion.rect
        x="80" y="22" width="40" height="20" rx="6"
        fill="#92400E"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      />
      {/* Scribbled messy lines */}
      {[66, 82, 98, 114, 130, 146, 162].map((y, i) => (
        <motion.line
          key={i}
          x1="44" y1={y}
          x2={i % 3 === 1 ? "136" : "156"} y2={y}
          stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" opacity={0.55}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.35 + i * 0.07, duration: 0.25 }}
        />
      ))}
      {/* Mini grid / manual floor plan at bottom */}
      <motion.rect
        x="42" y="168" width="116" height="16" rx="3"
        fill="white" stroke="#D97706" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      />
      <motion.path
        d="M100,168 L100,184 M42,176 L158,176"
        stroke="#D97706" strokeWidth="0.9"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 0.3 }}
      />
      {/* Clock — urgency indicator */}
      <motion.circle
        cx="156" cy="62" r="20"
        fill="white" stroke="#DC2626" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 280 }}
        style={{ transformOrigin: "156px 62px" }}
      />
      <motion.path
        d="M156,50 L156,62 L163,67"
        stroke="#DC2626" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.75, duration: 0.35 }}
      />
      {/* Stress squiggles */}
      {[{ x: 38, y: 48 }, { x: 162, y: 172 }].map((pt, i) => (
        <motion.text
          key={i} x={pt.x} y={pt.y}
          textAnchor="middle" fontSize="13" fill="#EF4444"
          animate={{ opacity: [0.3, 1, 0.3], rotate: [-8, 8, -8] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
          style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
        >
          !
        </motion.text>
      ))}
    </svg>
  );
}

// ─── Animated SVG: After (AreaSim canvas UI) ──────────────────────────────────

function AreaSimCanvasIllustration() {
  return (
    <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Screen / window frame */}
      <motion.rect
        x="10" y="16" width="200" height="164" rx="10"
        fill="#EFF8FF" stroke="#1A7FA8" strokeWidth="2"
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1, type: "spring" }}
        style={{ transformOrigin: "110px 98px" }}
      />
      {/* Header bar */}
      <motion.rect
        x="10" y="16" width="200" height="22" rx="10"
        fill="#0A4F6E"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.rect
        x="10" y="28" width="200" height="10"
        fill="#0A4F6E"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      {/* Header dots */}
      {[24, 34, 44].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy="27" r="4"
          fill={["#EF4444", "#F59E0B", "#22C55E"][i]}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.06 }}
        />
      ))}
      {/* "AreaSim Canvas" title in header */}
      <motion.text
        x="110" y="31" textAnchor="middle" fontSize="8.5" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        AreaSim Canvas
      </motion.text>

      {/* 2×2 grid of rooms */}
      <motion.rect x="14" y="42" width="130" height="134" rx="5"
        fill="#DBEAFE" stroke="#1A7FA8" strokeWidth="1"
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        style={{ transformOrigin: "79px 109px" }}
      />
      {/* Grid dividers */}
      {[{ d: "M14,109 L144,109" }, { d: "M79,42 L79,176" }].map((p, i) => (
        <motion.path key={i} d={p.d} stroke="#1A7FA8" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.65 + i * 0.15, duration: 0.35 }}
        />
      ))}
      {/* Room labels */}
      {[
        { x: 46, y: 80, label: "Meet" },
        { x: 111, y: 80, label: "Work" },
        { x: 46, y: 147, label: "Break" },
        { x: 111, y: 147, label: "Focus" },
      ].map((r, i) => (
        <motion.text key={i} x={r.x} y={r.y} textAnchor="middle" fontSize="8" fill="#1A7FA8" fontWeight="700"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.82 + i * 0.07 }}
        >
          {r.label}
        </motion.text>
      ))}

      {/* Stats sidebar */}
      <motion.rect x="150" y="42" width="56" height="134" rx="5"
        fill="white" stroke="#D0DDE6" strokeWidth="1"
        initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      />
      <motion.text x="178" y="56" textAnchor="middle" fontSize="6.5" fill="#8CA3B0" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.82 }}>
        STATS
      </motion.text>
      {[
        { y: 80, val: "12", lbl: "Rooms" },
        { y: 110, val: "4", lbl: "Zones" },
        { y: 140, val: "96", lbl: "Score" },
      ].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.88 + i * 0.1 }}>
          <text x="178" y={s.y} textAnchor="middle" fontSize="13" fill="#0A4F6E" fontWeight="800">{s.val}</text>
          <text x="178" y={s.y + 11} textAnchor="middle" fontSize="6" fill="#94A3B8">{s.lbl}</text>
        </motion.g>
      ))}

      {/* Small sparkles around the canvas */}
      {[{ x: 14, y: 18 }, { x: 204, y: 174 }, { x: 204, y: 18 }].map((pt, i) => (
        <motion.text key={i} x={pt.x} y={pt.y} textAnchor="middle" fontSize="9" fill="#0F7663"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.3, 0.6] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: 1.1 + i * 0.3 }}
          style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
        >
          ✦
        </motion.text>
      ))}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-[#F0F7FF] to-[#E8F4F0] flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <header className="shrink-0 bg-transparent px-8 py-3 flex items-center">
        <Logo size="md" />
      </header>

      {/* ── Hero heading ── */}
      <div className="text-center pt-2 pb-3 px-4 shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight"
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
        >
          See the difference AreaSim makes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
          className="mt-2 text-base text-[#4A6579] font-body max-w-xl mx-auto"
        >
          Here&apos;s what workspace management looks like before and after.
        </motion.p>
      </div>

      {/* ── Before / After split ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 px-6 lg:px-12 max-w-7xl mx-auto w-full min-h-0">

        {/* LEFT — Before */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 bg-red-50/60 border border-red-100 rounded-2xl flex flex-col items-center justify-between pt-5 px-5 pb-8 gap-3 overflow-hidden"
        >
          {/* Heading */}
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#DC2626", fontFamily: "var(--font-manrope)", fontWeight: 700 }}
          >
            Before
          </h2>

          {/* Stressed team circle */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-[90px] h-[90px] rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center"
              style={{ background: "rgba(254,226,226,0.35)" }}
            >
              <span className="text-4xl select-none">😩</span>
            </div>
            <span className="text-sm italic font-body" style={{ color: "#DC2626" }}>Stressed team</span>
          </div>

          {/* Clipboard illustration */}
          <div className="w-full max-w-[130px] h-[110px]">
            <ClipboardIllustration />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 border border-red-200 px-4 py-1.5 text-sm font-semibold font-body" style={{ color: "#DC2626" }}>
            Manual &amp; Time-Consuming
          </div>
        </motion.div>

        {/* CENTER divider */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-3 px-2 shrink-0 relative">
          {/* Dashed vertical line */}
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent" />
          {/* Upward arrow circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 260, damping: 18 }}
            className="w-12 h-12 rounded-full bg-[#0A4F6E] flex items-center justify-center shadow-lg shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent" />
        </div>

        {/* Mobile divider */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="flex-1 h-px bg-[#CBD5E1]" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 260, damping: 18 }}
            className="w-10 h-10 rounded-full bg-[#0A4F6E] flex items-center justify-center shadow-lg shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <div className="flex-1 h-px bg-[#CBD5E1]" />
        </div>

        {/* RIGHT — After */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col items-center justify-between pt-5 px-5 pb-8 gap-3 overflow-hidden"
        >
          {/* Heading */}
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#15803D", fontFamily: "var(--font-manrope)", fontWeight: 700 }}
          >
            After
          </h2>

          {/* Canvas illustration */}
          <div className="w-full max-w-[150px] h-[110px]">
            <AreaSimCanvasIllustration />
          </div>

          {/* Happy team circle with sparkles */}
          <div className="flex flex-col items-center gap-3 relative">
            {/* Sparkle decorations */}
            {[
              { top: "-14px", left: "-20px", delay: 0 },
              { top: "-14px", right: "-20px", delay: 0.4 },
              { bottom: "4px", left: "-22px", delay: 0.8 },
              { bottom: "4px", right: "-22px", delay: 1.2 },
            ].map((style, i) => (
              <motion.span
                key={i}
                className="absolute text-[#0F7663] text-base select-none pointer-events-none"
                style={style as React.CSSProperties}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.3, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: style.delay as number }}
              >
                ✦
              </motion.span>
            ))}
            <div
              className="w-[90px] h-[90px] rounded-full border-2 border-green-400 flex items-center justify-center relative"
              style={{ background: "rgba(209,250,229,0.45)" }}
            >
              <span className="text-4xl select-none">😄</span>
            </div>
            <span className="text-sm italic font-body" style={{ color: "#15803D" }}>Happy team</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-4 py-1.5 text-sm font-semibold font-body" style={{ color: "#15803D" }}>
            ✓ Fast &amp; Data-Driven
          </div>
        </motion.div>
      </div>

      {/* ── Message + CTA ── */}
      <div className="shrink-0 flex flex-col items-center gap-4 py-5 px-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="text-sm text-[#4A6579] font-body max-w-2xl text-center leading-relaxed"
        >
          With manual processes it&apos;s very time consuming. With AreaSim you do things fast using this webapp and save time with better satisfaction.{" "}
          <span className="font-semibold text-[#0A4F6E]">We&apos;ll guide you step by step to get started easily.</span>
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/onboarding")}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all"
          style={{
            background: "var(--color-primary)",
            boxShadow: "0 4px 16px rgba(10,79,110,0.25)",
            fontFamily: "var(--font-manrope)",
          }}
        >
          Let&apos;s Get Started
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M10 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-[#6B8A9A] font-body"
        >
          Takes less than 3 minutes to set up
        </motion.p>
      </div>

    </div>
  );
}
