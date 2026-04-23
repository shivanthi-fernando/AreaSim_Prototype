"use client";

import {
  useEffect, useRef, useState, useCallback
} from "react";
import { Stage, Layer, Image as KImage, Line, Circle, Text, Group, Rect } from "react-konva";
import Konva from "konva";
import { AnimatePresence, motion } from "framer-motion";
import {
  ZoomIn, ZoomOut, Undo2, Redo2,
  MousePointer2, PenLine, Layers, Group as GroupIcon, Eraser,
  HelpCircle, Upload,
} from "lucide-react";
import { useCanvasStore } from "@/store/canvas";
import { Room, ZONE_COLORS } from "@/lib/mockData";
import { RoomModal } from "./RoomModal";
import useImage from "use-image";
import { cn } from "@/lib/utils";

const FILL_COLORS = {
  unvisited: "rgba(10,79,110,0.18)",
  counting:  "rgba(245,158,11,0.18)",
  counted:   "rgba(0,201,167,0.20)",
};
const STROKE_COLORS = {
  unvisited: "rgba(10,79,110,0.6)",
  counting:  "rgba(245,158,11,0.7)",
  counted:   "rgba(0,201,167,0.8)",
};

type Tool = "select" | "pen" | "zone" | "group" | "eraser";

const TOOLS: { id: Tool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
  { id: "select",  icon: MousePointer2, label: "Select",    shortcut: "V" },
  { id: "pen",     icon: PenLine,       label: "Draw Room", shortcut: "P" },
  { id: "zone",    icon: Layers,        label: "Draw Zone", shortcut: "Z" },
  { id: "group",   icon: GroupIcon,     label: "Group",     shortcut: "G" },
  { id: "eraser",  icon: Eraser,        label: "Erase",     shortcut: "E" },
];

interface FloorCanvasProps {
  floorId: string;
  imageUrl: string;
  onOpenGuide: () => void;
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function FloorCanvas({ floorId, imageUrl, onOpenGuide }: FloorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { width, height } = useContainerSize(containerRef as React.RefObject<HTMLDivElement>);

  const {
    activeTool, getRoomsForFloor, getZonesForFloor,
    addRoom, deleteRoom, addZone,
    selectedRoomIds, toggleRoomSelection, clearSelection,
    setDetailPanel, setTool, updateRoomPoints,
  } = useCanvasStore();

  const rooms = getRoomsForFloor(floorId);
  const zones = getZonesForFloor(floorId);

  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const activeImageUrl = customImageUrl ?? imageUrl;
  const [bgImage] = useImage(activeImageUrl);

  const [drawPoints, setDrawPoints] = useState<number[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pendingRoom, setPendingRoom] = useState<Room | null>(null);
  const [pendingRoomPos, setPendingRoomPos] = useState({ x: 0, y: 0 });
  const [historyIdx, setHistoryIdx] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [showGroupBar, setShowGroupBar] = useState(false);
  const [uploadHint, setUploadHint] = useState(false);

  useEffect(() => {
    setShowGroupBar(activeTool === "group" && selectedRoomIds.length >= 2);
  }, [activeTool, selectedRoomIds]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _pushHistory = useCallback(() => setHistoryIdx((i) => i + 1), []);

  const undo = () => {
    if (historyIdx <= 0) return;
    setHistoryIdx((i) => i - 1);
  };

  const getPointerPos = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    return {
      x: (pos.x - offset.x) / scale,
      y: (pos.y - offset.y) / scale,
    };
  };

  const handleCanvasClick = () => {
    if (activeTool !== "pen") return;
    const pos = getPointerPos();
    if (drawPoints.length >= 6) {
      const [fx, fy] = drawPoints;
      const dist = Math.hypot(pos.x - fx, pos.y - fy);
      if (dist < 16) { finishPolygon(); return; }
    }
    setDrawPoints((pts) => [...pts, pos.x, pos.y]);
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = () => {
    const pos = getPointerPos();
    setMousePos(pos);
  };

  const handleCanvasDblClick = () => {
    if (activeTool !== "pen" || drawPoints.length < 6) return;
    finishPolygon();
  };

  const finishPolygon = () => {
    if (drawPoints.length < 6) return;
    const id = `room-${Date.now()}`;
    const newRoom: Room = {
      id,
      name: `Room ${rooms.length + 1}`,
      points: drawPoints,
      status: "unvisited",
      countHistory: [],
      currentCount: 0,
    };
    addRoom(floorId, newRoom);
    const xs = drawPoints.filter((_, i) => i % 2 === 0);
    const ys = drawPoints.filter((_, i) => i % 2 !== 0);
    const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
    setPendingRoom(newRoom);
    setPendingRoomPos({ x: cx * scale + offset.x, y: cy * scale + offset.y });
    setDrawPoints([]);
    setIsDrawing(false);
    setTool("select");
  };

  const handleRoomClick = (room: Room) => {
    if (activeTool === "eraser") { deleteRoom(floorId, room.id); return; }
    if (activeTool === "group" || activeTool === "select") {
      toggleRoomSelection(room.id);
      if (activeTool === "select" && !selectedRoomIds.includes(room.id)) {
        setPendingRoom(room);
        const xs = room.points.filter((_, i) => i % 2 === 0);
        const ys = room.points.filter((_, i) => i % 2 !== 0);
        const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
        const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
        setPendingRoomPos({ x: cx * scale + offset.x, y: cy * scale + offset.y });
      }
    }
  };

  const handleGroupZone = () => {
    if (selectedRoomIds.length < 2 || !groupName.trim()) return;
    const zoneId = `zone-${Date.now()}`;
    const color = ZONE_COLORS[zones.length % ZONE_COLORS.length];
    addZone(floorId, { id: zoneId, name: groupName.trim(), roomIds: selectedRoomIds, color });
    clearSelection();
    setGroupName("");
  };

  const zoom = (delta: number) => setScale((s) => Math.min(4, Math.max(0.3, s + delta)));
  const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  // Handle floor plan image upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setCustomImageUrl(url);
      setUploadHint(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Scale floor plan image to fill canvas
  let imgW = width, imgH = height;
  if (bgImage) {
    const ratio = Math.min(width / bgImage.width, height / bgImage.height);
    imgW = bgImage.width * ratio;
    imgH = bgImage.height * ratio;
  }
  const imgOffX = (width - imgW) / 2;
  const imgOffY = (height - imgH) / 2;

  const scaleX = bgImage ? imgW / bgImage.width : 1;
  const scaleY = bgImage ? imgH / bgImage.height : 1;

  const scaledPoints = (pts: number[]) =>
    pts.map((v, i) => (i % 2 === 0 ? v * scaleX + imgOffX : v * scaleY + imgOffY));

  const getCursor = () => {
    if (activeTool === "pen") return "crosshair";
    if (activeTool === "eraser") return "cell";
    return "default";
  };

  return (
    <div className="relative flex flex-col h-full bg-surface-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={handleUpload}
      />

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ cursor: getCursor() }}>
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          x={offset.x}
          y={offset.y}
          onClick={handleCanvasClick}
          onDblClick={handleCanvasDblClick}
          onMouseMove={handleCanvasMouseMove}
        >
          <Layer>
            {/* Floor plan image */}
            {bgImage && (
              <KImage
                image={bgImage}
                x={imgOffX / scale}
                y={imgOffY / scale}
                width={imgW / scale}
                height={imgH / scale}
              />
            )}

            {/* Existing rooms — draggable in select mode */}
            {rooms.map((room) => {
              // Skip stub rooms (AI-detected but not yet drawn)
              if (room.points.length === 0) return null;
              const pts = scaledPoints(room.points).map((v) => v / scale);
              const isSelected = selectedRoomIds.includes(room.id);
              const xs = pts.filter((_, i) => i % 2 === 0);
              const ys = pts.filter((_, i) => i % 2 !== 0);
              const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
              const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
              return (
                <Group
                  key={room.id}
                  draggable={activeTool === "select"}
                  onClick={() => handleRoomClick(room)}
                  onDragEnd={(e) => {
                    // Convert Konva-stage drag offset to original SVG/image coords
                    const gx = e.target.x();
                    const gy = e.target.y();
                    const dx = gx * scale / (scaleX || 1);
                    const dy = gy * scale / (scaleY || 1);
                    updateRoomPoints(floorId, room.id, dx, dy);
                    e.target.position({ x: 0, y: 0 });
                  }}
                >
                  <Line
                    points={pts}
                    closed
                    fill={isSelected ? "rgba(0,201,167,0.25)" : FILL_COLORS[room.status]}
                    stroke={isSelected ? "#00C9A7" : STROKE_COLORS[room.status]}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    listening
                  />
                  <Text
                    x={cx - 50} y={cy - 8}
                    width={100}
                    text={room.name}
                    align="center"
                    fontSize={11}
                    fill={isSelected ? "#0F7663" : "#0A4F6E"}
                    fontFamily="var(--font-manrope)"
                    fontStyle="600"
                    listening={false}
                  />
                  {room.status === "counted" && (
                    <Text
                      x={cx - 20} y={cy + 8}
                      width={40}
                      text={`${room.currentCount}`}
                      align="center"
                      fontSize={13}
                      fill="#0F7663"
                      fontFamily="var(--font-jetbrains-mono)"
                      fontStyle="bold"
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}

            {/* Zone dashed boundaries */}
            {zones.map((zone) => {
              const zoneRooms = rooms.filter((r) => zone.roomIds.includes(r.id));
              if (!zoneRooms.length) return null;
              const allPts = zoneRooms.flatMap((r) => scaledPoints(r.points).map((v) => v / scale));
              const allX = allPts.filter((_, i) => i % 2 === 0);
              const allY = allPts.filter((_, i) => i % 2 !== 0);
              const minX = Math.min(...allX) - 12;
              const minY = Math.min(...allY) - 12;
              const maxX = Math.max(...allX) + 12;
              const maxY = Math.max(...allY) + 12;
              return (
                <Group key={zone.id}>
                  <Rect
                    x={minX} y={minY}
                    width={maxX - minX} height={maxY - minY}
                    fill="transparent"
                    stroke={zone.color}
                    strokeWidth={2}
                    dash={[8, 5]}
                    cornerRadius={8}
                    listening={false}
                  />
                  <Text
                    x={minX + 8} y={minY + 6}
                    text={zone.name}
                    fontSize={11}
                    fill={zone.color}
                    fontFamily="var(--font-manrope)"
                    fontStyle="600"
                    listening={false}
                  />
                </Group>
              );
            })}

            {/* Active drawing polygon */}
            {isDrawing && drawPoints.length >= 2 && (
              <>
                <Line
                  points={[...drawPoints, mousePos.x, mousePos.y]}
                  stroke="#0A4F6E"
                  strokeWidth={1.5}
                  dash={[5, 4]}
                  listening={false}
                />
                {Array.from({ length: drawPoints.length / 2 }).map((_, i) => (
                  <Circle
                    key={i}
                    x={drawPoints[i * 2]}
                    y={drawPoints[i * 2 + 1]}
                    radius={i === 0 ? 6 : 4}
                    fill={i === 0 ? "#0F7663" : "#0A4F6E"}
                    stroke="white"
                    strokeWidth={1.5}
                    listening={false}
                  />
                ))}
              </>
            )}
          </Layer>
        </Stage>

        {/* Room modal overlay */}
        <AnimatePresence>
          {pendingRoom && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: Math.min(pendingRoomPos.x + 20, width - 300),
                top: Math.max(pendingRoomPos.y - 80, 8),
              }}
            >
              <div className="pointer-events-auto">
                <RoomModal
                  room={pendingRoom}
                  floorId={floorId}
                  onClose={() => setPendingRoom(null)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Pen tool hint */}
        {activeTool === "pen" && drawPoints.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          >
            <div className="rounded-full bg-primary/90 text-white text-xs font-body px-4 py-1.5 shadow-lg">
              Click to place points · Double-click or click first point to close
            </div>
          </motion.div>
        )}

        {/* Group zone bar */}
        <AnimatePresence>
          {showGroupBar && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface shadow-xl px-3 py-2">
                <span className="text-xs text-text-muted font-body">{selectedRoomIds.length} rooms selected</span>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Zone name…"
                  className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs font-body text-text focus:outline-none focus:border-primary w-32"
                />
                <button
                  onClick={handleGroupZone}
                  disabled={!groupName.trim()}
                  className="rounded-lg bg-primary text-white text-xs font-body px-3 py-1 hover:bg-primary-light transition-colors disabled:opacity-40"
                >
                  Group as Zone
                </button>
                <button onClick={clearSelection} className="text-text-muted hover:text-text transition-colors text-xs font-body">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload hint tooltip */}
        <AnimatePresence>
          {uploadHint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <div className="rounded-xl bg-[#0D1B2A]/90 text-white text-xs font-body px-4 py-2 shadow-xl text-center">
                Click the <strong>Upload</strong> button to use your own floor plan image
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Figma-style Floating Toolbar ─────────────────────────────── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-2xl border border-border bg-surface shadow-2xl shadow-black/15 px-2 py-1.5">

          {/* Tools */}
          {TOOLS.map(({ id, icon: Icon, label, shortcut }) => {
            const active = activeTool === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setTool(id)}
                title={`${label} (${shortcut})`}
                className={cn(
                  "group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                <Icon size={17} />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2 py-1 text-xs font-body text-text shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {label}
                  <span className="ml-1.5 text-text-muted font-mono">{shortcut}</span>
                </div>
              </motion.button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Zoom out */}
          <button onClick={() => zoom(-0.15)} title="Zoom out"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <ZoomOut size={15} />
          </button>

          {/* Zoom % */}
          <button onClick={resetZoom} title="Reset zoom"
            className="h-9 px-2 rounded-xl flex items-center justify-center text-xs font-mono text-text-muted hover:text-text hover:bg-surface-2 transition-all min-w-[44px]"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom in */}
          <button onClick={() => zoom(0.15)} title="Zoom in"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <ZoomIn size={15} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo */}
          <button onClick={undo} title="Undo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <Undo2 size={15} />
          </button>

          {/* Redo */}
          <button title="Redo"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <Redo2 size={15} />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Upload floor plan */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setUploadHint(true)}
            onMouseLeave={() => setUploadHint(false)}
            title="Upload floor plan"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all"
          >
            <Upload size={15} />
          </motion.button>

          {/* Help */}
          <button onClick={onOpenGuide} title="Open guide"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-all">
            <HelpCircle size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
