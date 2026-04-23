"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, CheckCircle2, Loader2, Circle,
  Pencil, ChevronRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCanvasStore } from "@/store/canvas";
import { useRouter, useParams } from "next/navigation";
import { mockProject } from "@/lib/mockData";
import { IllustrationDrawRoom } from "@/app/project/[id]/canvas/guide/page";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import type { Room } from "@/lib/mockData";

interface DetailPanelProps {
  floorId: string;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  counted: <CheckCircle2 size={13} className="text-accent shrink-0" />,
  counting: <Loader2 size={13} className="text-amber-500 shrink-0 animate-spin" />,
  unvisited: <Circle size={13} className="text-[#C8D8E4] shrink-0" />,
};

export function DetailPanel({ floorId: _initialFloorId }: DetailPanelProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const {
    detailPanelOpen, setDetailPanel,
    floors, getRoomsForFloor, getZonesForFloor, getDetectedRooms,
    addFloor, addRoom, setTool,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState(_initialFloorId);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

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
      sqm: 0,
      verified: false,
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
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5EAF0] shrink-0 bg-surface">
        <div>
          <p className="text-[10px] text-[#8CA3B0] tracking-wider font-body mb-0.5">Floor</p>
          <h2 className="text-sm font-bold text-[#0D1B2A] font-display leading-tight"
            style={{ fontFamily: "var(--font-manrope)" }}>
            {floor?.name ?? "Select Floor"}
          </h2>
        </div>
        <button
          onClick={() => setDetailPanel(false)}
          className="w-7 h-7 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#5C7A8A] hover:bg-[#E5EAF0] transition-colors"
        >
          <X size={14} />
        </button>
      </div>


      {/* ── Scrollable Body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Mapped Rooms and Zones section */}
        {(zones.length > 0 || rooms.length > 0) && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-[#0D1B2A] font-bold font-body tracking-wider uppercase">Rooms</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/project/${projectId}/floor/${floor.id}/count`)}
                className="border-primary text-primary hover:bg-primary/5 h-8 text-[14px] font-bold"
              >
                Start room counting
              </Button>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl border border-[#E5EAF0] overflow-hidden">
                {rooms.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onUpdate={(data) => {
                      if (data.verified) {
                        setShowVerifyModal(true);
                        setTool("pen");
                      } else {
                        useCanvasStore.getState().updateRoom(floor.id, room.id, data);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Add Room button right below the list */}
            <button
              onClick={() => {
                const newRoom: Room = {
                  id: `room-${Date.now()}`,
                  name: "New Room",
                  points: [],
                  status: "unvisited",
                  countHistory: [],
                  currentCount: 0,
                  sqm: 0,
                };
                addRoom(floor.id, newRoom);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#D0DDE6] py-2.5 text-xs text-[#8CA3B0] hover:border-primary hover:text-primary hover:bg-[#F0F6FB] transition-all font-body"
            >
              <Plus size={14} /> Add room
            </button>
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


      {/* Verification Guidance Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5EAF0]">
                <Logo size="sm" />
                <button onClick={() => setShowVerifyModal(false)} className="text-[#5C7A8A] hover:text-[#0D1B2A]">
                  <X size={18} />
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-[#D0DDE6] h-44 flex items-center justify-center p-6">
                <IllustrationDrawRoom />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "var(--font-manrope)" }}>Verify with Draw Room tool</h3>
                <p className="text-sm text-[#5C7A8A] font-body leading-relaxed mb-6">
                  To verify this room on the floor plan, pick the <span className="font-bold text-primary">Draw room</span> tool from the toolbar and trace the relevant room boundaries.
                </p>
                <Button className="w-full h-11 rounded-xl" onClick={() => setShowVerifyModal(false)}>
                  Got it, I&apos;ll draw it
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

// ─── Room row component ───────────────────────────────────────────────────────
function RoomRow({
  room,
  onUpdate,
}: {
  room: Room;
  onUpdate: (data: Partial<Room>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(room.name);

  const handleRename = () => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="border-b border-[#F0F4F8] last:border-0 bg-white hover:bg-[#F7F9FC] transition-colors">
      <div className="flex items-center justify-between px-3 py-2.5 group">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {STATUS_ICON[room.status]}
          {isEditing ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="text-xs text-[#374151] font-body bg-[#F0F6FB] border border-primary/20 rounded px-1 outline-none w-full"
            />
          ) : (
            <div className="flex items-center gap-1 min-w-0 flex-1 text-left">
              <span className="text-xs text-[#374151] font-bold font-body truncate">{room.name}</span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex items-center gap-1 transition-opacity",
          room.verified ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {room.verified ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-accent-text text-[10px] font-bold">
              <CheckCircle2 size={11} /> Verified
            </div>
          ) : (
            <>
              <button
                onClick={() => isEditing ? handleRename() : setIsEditing(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-all text-[10px] font-bold"
              >
                <Pencil size={11} /> Edit
              </button>
              
              <button
                onClick={() => onUpdate({ verified: true })}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-accent hover:bg-accent/5 transition-all text-[10px] font-bold"
              >
                <CheckCircle2 size={11} /> Verify
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats card — shown when counted and expanded */}
      <AnimatePresence>
        {room.status === "counted" && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {(() => {
              // Deterministic mock stats based on name hash
              const hash = room.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
              const roomTypes = ["Meeting Room", "Open Office", "Break Room", "Focus Room", "Reception", "Storage"];
              const roomType = roomTypes[hash % roomTypes.length];
              const seats = 2 + (hash % 12);
              const todayCount = 1 + (hash % 4);
              const totalCount = todayCount + (hash % 10) + 2;
              const avgCapacity = Math.round(seats * (0.5 + (hash % 4) * 0.1));

              return (
                <div className="mx-3 mb-2.5 rounded-xl bg-[#F0F6FB] border border-[#DAEAF5] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Type</span>
                    <span className="text-[10px] font-semibold text-[#0D1B2A] bg-[#DBEAFE] text-primary px-2 py-0.5 rounded-full font-body">{roomType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Seats</span>
                    <span className="text-[10px] font-bold text-[#374151] font-mono" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{seats}</span>
                  </div>
                  <div className="h-px bg-[#DAEAF5]" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white border border-[#E5EAF0] p-2 text-center">
                      <p className="text-[13px] font-extrabold text-[#1A7FA8]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{formatNumber(todayCount)}×</p>
                      <p className="text-[9px] text-[#8CA3B0] font-body">Today</p>
                    </div>
                    <div className="rounded-lg bg-white border border-[#E5EAF0] p-2 text-center">
                      <p className="text-[13px] font-extrabold text-[#0A4F6E]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{formatNumber(totalCount)}×</p>
                      <p className="text-[9px] text-[#8CA3B0] font-body">Overall</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8CA3B0] font-body">Avg capacity</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1.5 rounded-full bg-[#E5EAF0] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#1A7FA8] to-[#00C9A7]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((avgCapacity / seats) * 100)}%` }}
                          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#374151] font-mono" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{formatNumber(avgCapacity)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
