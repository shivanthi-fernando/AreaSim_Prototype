"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronDown, CheckCircle2, SlidersHorizontal, ClipboardList, Gem, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { ScoreWidget } from "@/components/canvas/ScoreWidget";
import { DetailPanel } from "@/components/canvas/DetailPanel";
import { SurveyModal } from "@/components/canvas/SurveyModal";
import { CompletionModal } from "@/components/canvas/CompletionModal";
import { useCanvasStore } from "@/store/canvas";
import { mockProject } from "@/lib/mockData";

const FloorCanvas = dynamic(
  () => import("@/components/canvas/FloorCanvas").then((m) => m.FloorCanvas),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-text-muted font-body text-sm">Loading canvas…</div> }
);

export default function FloorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const {
    floors, setActiveFloor,
    setDetailPanel, detailPanelOpen,
    setSurveyModal, setCompletionModal,
  } = useCanvasStore();

  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);

  const activeFloor = floors.find((f) => f.id === floorId) ?? floors[0];
  const activeFloorRooms = activeFloor?.rooms ?? [];
  const allCounted = activeFloorRooms.length > 0 && activeFloorRooms.every((r) => r.status === "counted");

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-3 py-2 border-b border-border bg-surface shrink-0">
        {/* Logo — navigates to dashboard */}
        <button onClick={() => router.push("/dashboard")} className="shrink-0">
          <Logo size="sm" showText={false} />
        </button>

        <div className="w-px h-5 bg-border" />

        {/* Project name */}
        <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[200px]">
          {mockProject.name}
        </span>

        <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />

        {/* Floor selector */}
        <div className="relative">
          <button
            onClick={() => setFloorDropdownOpen(!floorDropdownOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text font-body hover:border-primary/50 transition-colors"
          >
            {activeFloor?.name ?? "Select Floor"}
            <ChevronDown size={14} className="text-text-muted" />
          </button>
          <AnimatePresence>
            {floorDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-border bg-surface shadow-lg z-50 py-1 overflow-hidden"
              >
                {floors.map((floor) => {
                  const allDone = floor.rooms.length > 0 && floor.rooms.every((r) => r.status === "counted");
                  return (
                    <button
                      key={floor.id}
                      onClick={() => {
                        setActiveFloor(floor.id);
                        router.push(`/project/${projectId}/floor/${floor.id}`);
                        setFloorDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-body hover:bg-surface-2 transition-colors ${floor.id === floorId ? "text-primary font-semibold" : "text-text"}`}
                    >
                      <span>{floor.name}</span>
                      {allDone && <CheckCircle2 size={14} className="text-accent" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 py-2" />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<SlidersHorizontal size={14} />}
            onClick={() => setDetailPanel(!detailPanelOpen)}
            className="h-10 py-2 px-4"
          >
            <span className="hidden sm:inline">Rooms list</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<ClipboardList size={14} />}
            onClick={() => setSurveyModal(true)}
            className="border-primary text-primary hover:bg-primary/5 h-10 py-2 px-4"
          >
            <span className="hidden sm:inline">Conduct Survey</span>
          </Button>

          {allCounted && (
            <button
              onClick={() => setCompletionModal(true)}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold font-body transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 0 0 1.5px #F59E0B40, 0 2px 8px rgba(245,158,11,0.3)",
                color: "white",
              }}
            >
              <Gem size={14} className="shrink-0" />
              <span className="hidden sm:inline">Room Program</span>
            </button>
          )}

          <LanguageSelector />

          {/* User avatar */}
          <button
            onClick={() => router.push("/settings")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 hover:opacity-80 transition-opacity"
            title="Settings"
          >
            <User size={14} />
          </button>
        </div>
      </header>

      {/* ── Main Area ── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Canvas always full width */}
        <div className="w-full h-full flex flex-col relative">
          {/* Floating ScoreWidget */}
          <div className="absolute top-4 left-4 z-40">
            <ScoreWidget />
          </div>

          <FloorCanvas
            floorId={floorId}
            imageUrl={activeFloor?.imageUrl ?? "/mock/floorplan-oslo.svg"}
            onOpenGuide={() => router.push(`/project/${projectId}/canvas/guide`)}
          />
        </div>

        {/* Detail panel — absolute overlay, right-aligned, 1/3 screen width */}
        <DetailPanel floorId={floorId} />
      </div>

      {/* Modals */}
      <SurveyModal />
      <CompletionModal />
    </div>
  );
}
