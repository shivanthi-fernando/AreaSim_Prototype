"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Building2, BarChart3, ClipboardCheck,
  ArrowRight, Clock, TrendingUp, Plus, X, Mail,
  UserPlus, Send, Users,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser, mockActivity, mockProjects, mockDashboardStats } from "@/lib/mockData";
import { cn } from "@/lib/utils";

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return value;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, suffix = "", gradient, delay }: {
  icon: React.ReactNode; label: string; value: number; suffix?: string; gradient: string; delay: number;
}) {
  const count = useCountUp(value, 1200 + delay * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.12, duration: 0.5 }}
      className="relative rounded-2xl border border-border bg-surface p-5 overflow-hidden group hover:shadow-card-hover transition-shadow"
    >
      <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl", gradient)} />
      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", gradient, "opacity-90")}>
          {icon}
        </div>
        <p className="text-xs text-text-muted font-body tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-text tabular-nums" style={{ fontFamily: "var(--font-manrope)" }}>
          {count}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Activity helpers ─────────────────────────────────────────────────────────
const ACTIVITY_COLORS: Record<string, string> = {
  room:    "bg-primary/10 text-primary",
  survey:  "bg-accent/10 text-accent",
  floor:   "bg-amber-500/10 text-amber-600",
  member:  "bg-purple-500/10 text-purple-600",
  project: "bg-blue-500/10 text-blue-600",
};
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  room:    <Building2 size={14} />,
  survey:  <ClipboardCheck size={14} />,
  floor:   <BarChart3 size={14} />,
  member:  <FolderOpen size={14} />,
  project: <FolderOpen size={14} />,
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    "bg-accent/10 text-accent",
    draft:     "bg-amber-500/10 text-amber-600",
    completed: "bg-primary/10 text-primary",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-body", map[status] ?? "bg-border text-text-muted")}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────
function InviteModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState([""]);
  const [sent, setSent] = useState(false);

  const addEmail = () => setEmails((prev) => [...prev, ""]);
  const updateEmail = (i: number, val: string) =>
    setEmails((prev) => prev.map((e, idx) => (idx === i ? val : e)));
  const removeEmail = (i: number) =>
    setEmails((prev) => prev.filter((_, idx) => idx !== i));

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
      >
        {/* Gradient top banner */}
        <div className="relative bg-gradient-to-br from-primary via-primary-light to-accent px-6 pt-6 pb-10">
          {/* decorative grid */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors">
            <X size={14} />
          </button>
          {/* Illustration: avatar cluster */}
          <div className="relative z-10 flex items-end gap-1 mb-4">
            {["IH", "MT", "SL"].map((init, i) => (
              <motion.div
                key={init}
                initial={{ scale: 0, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold"
                style={{ marginLeft: i > 0 ? "-6px" : 0 }}
              >
                {init}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.32, type: "spring" }}
              className="w-10 h-10 rounded-full bg-white/10 border-2 border-dashed border-white/40 flex items-center justify-center"
              style={{ marginLeft: "-6px" }}
            >
              <Plus size={14} className="text-white/70" />
            </motion.div>
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-extrabold text-white" style={{ fontFamily: "var(--font-manrope)" }}>
              Invite your team
            </h2>
            <p className="text-white/70 text-xs font-body mt-0.5">
              Collaborate on projects, count rooms, and run surveys together.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pt-5 pb-6 -mt-4 bg-surface rounded-t-3xl relative z-10">
          <AnimatePresence>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                  <Send size={22} className="text-accent" />
                </div>
                <p className="text-sm font-semibold text-text font-body">Invites sent!</p>
              </motion.div>
            ) : (
              <motion.div className="space-y-3">
                <p className="text-xs font-semibold text-text-muted tracking-wider font-body mb-3 flex items-center gap-1.5">
                  <Users size={12} /> Email addresses
                </p>
                {emails.map((email, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                      <Mail size={14} className="text-text-muted shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(i, e.target.value)}
                        placeholder={`colleague${i + 1}@company.no`}
                        className="flex-1 text-sm text-text bg-transparent outline-none font-body placeholder:text-text-muted/50"
                      />
                    </div>
                    {emails.length > 1 && (
                      <button onClick={() => removeEmail(i)}
                        className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-accent-warm transition-colors shrink-0">
                        <X size={13} />
                      </button>
                    )}
                  </motion.div>
                ))}

                <button
                  onClick={addEmail}
                  className="flex items-center gap-1.5 text-xs text-primary font-semibold font-body hover:underline"
                >
                  <Plus size={13} /> Add another
                </button>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-muted hover:text-text hover:border-border/60 transition-all font-body"
                  >
                    Maybe later
                  </button>
                  <button
                    onClick={handleSend}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 font-body"
                  >
                    <UserPlus size={14} /> Send invites
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const firstName = mockUser.name.split(" ")[0];
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Show invite modal on first visit
  useEffect(() => {
    const timer = setTimeout(() => setShowInviteModal(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: <FolderOpen size={20} className="text-white" />, label: "Total projects",     value: mockDashboardStats.totalProjects,     suffix: "",  gradient: "bg-gradient-to-br from-primary to-primary-light", delay: 0 },
    { icon: <Building2 size={20} className="text-white" />,  label: "Rooms mapped",       value: mockDashboardStats.totalRooms,         suffix: "",  gradient: "bg-gradient-to-br from-accent to-emerald-400",    delay: 1 },
    { icon: <TrendingUp size={20} className="text-white" />, label: "Avg. utilisation",   value: mockDashboardStats.avgUtilisation,     suffix: "%", gradient: "bg-gradient-to-br from-amber-400 to-orange-500",  delay: 2 },
    { icon: <ClipboardCheck size={20} className="text-white" />, label: "Survey responses", value: mockDashboardStats.surveysCompleted, suffix: "",  gradient: "bg-gradient-to-br from-purple-500 to-indigo-500", delay: 3 },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <AnimatePresence>
        {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
      </AnimatePresence>

      <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        {/* ── Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent p-8"
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-body mb-1">Welcome back,</p>
              <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-manrope)" }}>
                {firstName} 👋
              </h1>
              <p className="text-white/70 text-sm font-body mt-2 max-w-sm">
                You have {mockProjects.filter((p) => p.status === "active").length} active projects. Your workspace intelligence is up to date.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => router.push("/project")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors backdrop-blur-sm"
              >
                View projects <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div>
          <h2 className="text-base font-bold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* ── Projects + Activity ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Recent Projects</h2>
              <button onClick={() => router.push("/project")}
                className="text-xs text-primary font-semibold font-body hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {mockProjects.map((project, i) => (
                <motion.div key={project.id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="rounded-2xl border border-border bg-surface p-4 hover:shadow-card-hover hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-text truncate" style={{ fontFamily: "var(--font-manrope)" }}>{project.name}</p>
                        <p className="text-xs text-text-muted font-body truncate">{project.buildingName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={project.status} />
                      <ArrowRight size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-text-muted font-body">
                    <span>{project.floors} floors</span>
                    <span>{project.rooms} rooms</span>
                    <span>{project.surveyResponses} responses</span>
                    <span className="ml-auto flex items-center gap-1"><Clock size={11} /> {project.lastUpdated}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted font-body">Completion</span>
                      <span className="font-semibold text-text">{project.completionPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${project.completionPct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={() => router.push("/project")}
                className="w-full rounded-2xl border-2 border-dashed border-border hover:border-primary/40 py-4 flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-all font-body"
              >
                <Plus size={16} /> New project
              </motion.button>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-text mb-4" style={{ fontFamily: "var(--font-manrope)" }}>Recent Activity</h2>
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative">
                <div className="absolute left-8 top-4 bottom-4 w-px bg-border" />
                <div className="divide-y divide-border">
                  {mockActivity.map((item, i) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors"
                    >
                      <div className={cn("relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0", ACTIVITY_COLORS[item.type])}>
                        {ACTIVITY_ICONS[item.type]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text font-body leading-snug">
                          <span className="font-semibold">{item.user}</span>{" "}{item.action}{" "}
                          <span className="text-primary font-medium">{item.target}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
