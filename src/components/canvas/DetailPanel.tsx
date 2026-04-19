"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X, Plus, CheckCircle2, Loader2, Circle,
  Pencil, Play, ChevronRight, Sparkles,
} from "lucide-react";
import { useCanvasStore } from "@/store/canvas";
import { useRouter, useParams } from "next/navigation";
import { mockProject } from "@/lib/mockData";
import type { Room } from "@/lib/mockData";

interface DetailPanelProps {
  floorId: string;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  counted:   <CheckCircle2 size={13} className="text-accent shrink-0" />,
  counting:  <Loader2 size={13} className="text-amber-500 shrink-0 animate-spin" />,
  unvisited: <Circle size={13} className="text-[#C8D8E4] shrink-0" />,
};

export function DetailPanel({ floorId: _initialFloorId }: DetailPanelProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const {
    detailPanelOpen, setDetailPanel,
    floors, getRoomsForFloor, getZonesForFloor, getDetectedRooms,
    addFloor, addRoom,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState(_initialFloorId);

  const floor = floors.find((f) => f.id === activeTab) ?? floors[0];
  const rooms = getRoomsForFloor(floor?.id ?? "");
  const zones = getZonesForFloor(floor?.id ?? "");
  const detectedRooms = getDetectedRooms(floor?.id ?? "");
  const unzonedRooms = rooms.filter((r) => !r.zoneId);

  const pendingDetected = detectedRooms.filter(
    (dr) => !dr.verified && !rooms.some((r) => r.name.toLowerCase().trim() === dr.name.toLowerCase().trim())
  );
  const matchedRooms = rooms.filter((r) =>
    detectedRooms.some((dr) => dr.name.toLowerCase().trim() === r.name.toLowerCase().trim())
  );

  const handleAddFloor = () => {
    const newFloor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${floors.length + 1}`,
      level: `${floors.length}`,
      imageUrl: "/mock/floorplan-oslo.svg",
      rooms: [],
      zones: [],
      detectedRooms: [],
    };
    addFloor(newFloor);
    setActiveTab(newFloor.id);
  };

  // Start counting for an AI-detected room — add stub room if not drawn yet
  const handleCountDetected = (drId: string, drName: string) => {
    if (!floor) return;
    const existingRoom = rooms.find(
      (r) => r.name.toLowerCase().trim() === drName.toLowerCase().trim() || r.id === drId
    );
    if (existingRoom) {
      router.push(`/project/${projectId}/room/${existingRoom.id}/count`);
      return;
    }
    // Add stub room (no polygon drawn) so count page can resolve the name
    const stubRoom: Room = {
      id: drId,
      name: drName,
      points: [],
      status: "unvisited",
      countHistory: [],
      currentCount: 0,
    };
    addRoom(floor.id, stubRoom);
    router.push(`/project/${projectId}/room/${drId}/count`);
  };

  if (!detailPanelOpen) return null;

  return (
    <motion.aside
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-0 top-0 h-full bg-surface flex flex-col border-l border-[#E5EAF0] overflow-hidden shadow-2xl z-40"
      style={{ width: "33.333%", minWidth: "280px", maxWidth: "460px" }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5EAF0] shrink-0">
        <div>
          <p className="text-[10px] text-[#8CA3B0] uppercase tracking-wider font-body mb-0.5">Project</p>
          <h2 className="text-sm font-bold text-[#0D1B2A] font-display leading-tight"
            style={{ fontFamily: "var(--font-manrope)" }}>
            {mockProject.buildingName}
          </h2>
        </div>
        <button
          onClick={() => setDetailPanel(false)}
          className="w-7 h-7 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#5C7A8A] hover:bg-[#E5EAF0] transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Floor Tabs ────────────────────────────────────────────── */}
      <div className="border-b border-[#E5EAF0] px-3 pt-3 pb-0 shrink-0">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`shrink-0 px-3 py-2 text-xs font-semibold font-body border-b-2 transition-all whitespace-nowrap ${
                activeTab === f.id
                  ? "border-primary text-primary"
                  : "border-transparent text-[#8CA3B0] hover:text-[#374151]"
              }`}
            >
              {f.name}
            </button>
          ))}
          <button
            onClick={handleAddFloor}
            className="shrink-0 ml-1 flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#8CA3B0] hover:text-primary rounded-lg hover:bg-[#F0F6FB] transition-all border border-dashed border-[#D0DDE6] mb-2 whitespace-nowrap"
          >
            <Plus size={11} /> Add floor
          </button>
        </div>
      </div>

      {/* ── Scrollable Body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Mapped Rooms and Zones section */}
        {(zones.length > 0 || rooms.length > 0) && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] text-[#8CA3B0] font-body mb-3 uppercase tracking-wider">Mapped Rooms &amp; Zones</p>

            <div className="space-y-2">
              {zones.map((zone) => {
                const zoneRooms = rooms.filter((r) => zone.roomIds.includes(r.id));
                return (
                  <div key={zone.id} className="rounded-xl border border-[#E5EAF0] overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2.5 bg-white">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: zone.color }} />
                        <span className="text-xs font-bold text-[#0D1B2A] truncate">{zone.name}</span>
                        {zone.category && (
                          <>
                            <ChevronRight size={10} className="text-[#C0D0DC] shrink-0" />
                            <span className="text-xs text-[#8CA3B0] truncate">{zone.category}</span>
                          </>
                        )}
                      </div>
                      <button className="w-6 h-6 rounded-md bg-[#F7F9FC] flex items-center justify-center text-[#8CA3B0] hover:text-primary transition-colors shrink-0">
                        <Pencil size={11} />
                      </button>
                    </div>
                    <div className="border-t border-[#F0F4F8]">
                      {zoneRooms.map((room) => (
                        <RoomRow
                          key={room.id}
                          name={room.name}
                          status={room.status}
                          count={room.currentCount}
                          onCount={() => router.push(`/project/${projectId}/room/${room.id}/count`)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {unzonedRooms.length > 0 && zones.length > 0 && (
                <div className="rounded-xl border border-[#E5EAF0] overflow-hidden">
                  <div className="px-3 py-2.5 bg-white border-b border-[#F0F4F8]">
                    <span className="text-xs font-bold text-[#0D1B2A]">Other Rooms</span>
                  </div>
                  {unzonedRooms.map((room) => (
                    <RoomRow
                      key={room.id}
                      name={room.name}
                      status={room.status}
                      count={room.currentCount}
                      onCount={() => router.push(`/project/${projectId}/room/${room.id}/count`)}
                    />
                  ))}
                </div>
              )}

              {zones.length === 0 && rooms.length > 0 && (
                <div className="rounded-xl border border-[#E5EAF0] overflow-hidden">
                  {rooms.map((room) => (
                    <RoomRow
                      key={room.id}
                      name={room.name}
                      status={room.status}
                      count={room.currentCount}
                      onCount={() => router.push(`/project/${projectId}/room/${room.id}/count`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        {(zones.length > 0 || rooms.length > 0) && pendingDetected.length > 0 && (
          <div className="h-px bg-[#F0F4F8] mx-4 my-2" />
        )}

        {/* AI-Detected rooms */}
        {pendingDetected.length > 0 && (
          <div className="px-4 pt-3 pb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-accent" />
              <p className="text-[11px] text-[#8CA3B0] font-body uppercase tracking-wider">
                AI-Identified Rooms
                <span className="ml-1.5 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-semibold normal-case tracking-normal">
                  {pendingDetected.length} unverified
                </span>
              </p>
            </div>
            <p className="text-[10px] text-[#A0B3BE] mb-2 font-body">Counting is allowed without drawing. Draw to verify.</p>
            <div className="rounded-xl border border-[#E5EAF0] overflow-hidden">
              {pendingDetected.map((dr) => (
                <div key={dr.id}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-[#F0F4F8] last:border-0 bg-white hover:bg-[#F7F9FC] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full border-2 border-dashed border-[#C0D0DC] shrink-0" />
                    <span className="text-xs text-[#5C7A8A] font-body truncate">{dr.name}</span>
                  </div>
                  <button
                    onClick={() => handleCountDetected(dr.id, dr.name)}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#F0F6FB] text-[#5C7A8A] hover:bg-primary hover:text-white transition-all"
                  >
                    <Play size={9} className="fill-current" />
                    Count
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified rooms info */}
        {matchedRooms.length > 0 && (
          <div className="px-4 pb-3">
            <p className="text-[10px] text-accent font-body font-semibold">
              ✓ {matchedRooms.length} room{matchedRooms.length > 1 ? "s" : ""} verified from floor plan
            </p>
          </div>
        )}

        {/* Empty state */}
        {rooms.length === 0 && zones.length === 0 && detectedRooms.length === 0 && (
          <div className="px-4 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F6FB] flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-[#A0B3BE]" />
            </div>
            <p className="text-sm font-semibold text-[#0D1B2A] mb-1">No rooms yet</p>
            <p className="text-xs text-[#8CA3B0] leading-relaxed">
              Use the pen tool in the canvas to draw rooms.
            </p>
          </div>
        )}

        <div className="h-16" />
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-t border-[#E5EAF0] bg-white">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#D0DDE6] py-2.5 text-sm text-[#8CA3B0] hover:border-primary hover:text-primary hover:bg-[#F0F6FB] transition-all font-body">
          <Plus size={14} /> Add new zone
        </button>
      </div>
    </motion.aside>
  );
}

// ─── Room row component ───────────────────────────────────────────────────────
function RoomRow({
  name,
  status,
  count,
  onCount,
}: {
  name: string;
  status: "unvisited" | "counting" | "counted";
  count: number;
  onCount: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#F0F4F8] last:border-0 bg-white hover:bg-[#F7F9FC] transition-colors group">
      <div className="flex items-center gap-2 min-w-0">
        {STATUS_ICON[status]}
        <span className="text-xs text-[#374151] font-body truncate">{name}</span>
        {status === "counted" && (
          <span className="text-[10px] font-mono font-bold text-accent ml-1"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            {count}
          </span>
        )}
      </div>
      <button
        onClick={onCount}
        title="Start counting"
        className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
          status === "counted"
            ? "bg-accent/10 text-accent"
            : "bg-[#F0F6FB] text-[#5C7A8A] hover:bg-primary hover:text-white"
        }`}
      >
        <Play size={9} className="fill-current" />
        {status === "counted" ? "Recount" : "Count"}
      </button>
    </div>
  );
}
