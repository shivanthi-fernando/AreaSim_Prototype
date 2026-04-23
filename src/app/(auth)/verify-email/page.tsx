"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("your email");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("signup-email");
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    if (char && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
    if (next.every((d) => d)) handleVerify();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      const next = pasted.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
      setOtp(next);
      refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 900));
    setVerifying(false);
    router.push("/create-password");
  };

  return (
    <div className="space-y-8 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }} className="flex justify-center">
        <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25">
          <Mail size={36} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-2xl font-700 text-text mb-2" style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
          Check your inbox
        </h1>
        <p className="text-sm text-text-muted font-body">
          We&apos;ve sent a 6-digit code to <span className="text-text font-medium">{email}</span>
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2.5" onPaste={handlePaste}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric"
            maxLength={1} value={otp[i]} onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-600 rounded-xl border-2 bg-surface text-text transition-all duration-200 focus:outline-none ${
              otp[i] ? "border-primary ring-2 ring-primary/20" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`} style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 600 }} />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Button className="w-full" size="lg" onClick={() => handleVerify()} loading={verifying}>
          Verify email
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {canResend ? (
          <button onClick={() => { setCountdown(60); setCanResend(false); setOtp(Array(OTP_LENGTH).fill("")); }}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-body font-medium">
            <RefreshCw size={13} /> Resend code
          </button>
        ) : (
          <p className="text-sm text-text-muted font-body">
            Resend in <span className="font-mono text-text font-medium">
              {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
            </span>
          </p>
        )}
      </motion.div>
    </div>
  );
}
