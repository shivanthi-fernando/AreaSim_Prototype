"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClipboardList, Filter, Eye, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockSurveyRecords } from "@/lib/mockData";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "sent" | "draft" | "archived";

const STATUS_STYLES: Record<string, string> = {
  sent:     "bg-accent/10 text-accent",
  draft:    "bg-amber-500/10 text-amber-600",
  archived: "bg-border text-text-muted",
};

export default function SurveysPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const filtered = mockSurveyRecords.filter((s) => {
    const matchStatus  = filter === "all" || s.status === filter;
    const matchProject = projectFilter === "all" || s.project === projectFilter;
    return matchStatus && matchProject;
  });

  const projects = Array.from(new Set(mockSurveyRecords.map((s) => s.project)));

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all",      label: "All" },
    { id: "sent",     label: "Sent" },
    { id: "draft",    label: "Draft" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Surveys" }]}>
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
              Surveys
            </h1>
            <p className="text-sm text-text-muted font-body mt-1">
              {mockSurveyRecords.length} surveys across {projects.length} projects
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold px-4 py-2.5 text-sm font-body transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 active:scale-95">
            <Plus size={16} /> Create new survey
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1">
            {FILTER_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all",
                  filter === id
                    ? "bg-surface text-text shadow-sm"
                    : "text-text-muted hover:text-text"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Project dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-text-muted" />
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-xs font-body text-text bg-surface border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No surveys found"
            subtitle="No surveys match your current filter. Try adjusting the filters above."
          />
        ) : (
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_80px_120px_80px_auto] gap-4 px-5 py-3 border-b border-border bg-surface-2 text-xs font-semibold text-text-muted tracking-wider font-body">
              <span>Survey Name</span>
              <span className="hidden md:block">Project / Floor</span>
              <span className="hidden lg:block">Sent To</span>
              <span className="hidden lg:block">Responses</span>
              <span className="hidden sm:block">Completion</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map((survey, i) => {
              const pct = survey.sentTo > 0 ? Math.round((survey.responses / survey.sentTo) * 100) : 0;
              return (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[2fr_1.5fr_1fr_80px_120px_80px_auto] gap-4 px-5 py-4 border-b border-border last:border-0 items-center hover:bg-surface-2 transition-colors"
                >
                  {/* Survey Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardList size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text font-body truncate">{survey.name}</p>
                      <p className="text-xs text-text-muted font-body">{survey.createdAt}</p>
                    </div>
                  </div>

                  {/* Project / Floor */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-xs font-medium text-text font-body truncate">{survey.project}</p>
                    <p className="text-xs text-text-muted font-body truncate">{survey.floor}</p>
                  </div>

                  {/* Sent To */}
                  <span className="hidden lg:block text-sm text-text font-body">{survey.sentTo > 0 ? survey.sentTo : "—"}</span>

                  {/* Responses */}
                  <span className="hidden lg:block text-sm font-semibold text-text">{survey.responses}</span>

                  {/* Completion bar */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-accent" : "bg-primary")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text w-8 text-right">{pct}%</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-body whitespace-nowrap", STATUS_STYLES[survey.status])}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </span>

                  {/* Actions */}
                  <button
                    onClick={() => router.push(`/surveys/${survey.id}`)}
                    className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors font-body whitespace-nowrap"
                  >
                    <Eye size={13} /> View
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
