"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { X, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCanvasStore } from "@/store/canvas";
import { Room } from "@/lib/mockData";

interface RoomModalProps {
  room: Room;
  floorId: string;
  onClose: () => void;
  onViewDetails: () => void;
}

/** Floating modal that appears after drawing a room polygon. */
export function RoomModal({ room, floorId, onClose, onViewDetails }: RoomModalProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { updateRoom } = useCanvasStore();
  const [name, setName] = useState(room.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleNameBlur = () => {
    if (name.trim()) updateRoom(floorId, room.id, { name: name.trim() });
  };

  const handleCount = () => {
    updateRoom(floorId, room.id, { name: name.trim() || room.name, status: "counting" });
    router.push(`/project/${projectId}/room/${room.id}/count`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="w-72 rounded-2xl border border-border bg-surface shadow-xl shadow-primary/10 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
          <span className="text-xs font-semibold text-text-muted font-body uppercase tracking-wider">
            New Room
          </span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Room name input */}
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleNameBlur}
        placeholder="Room name…"
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text font-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-3"
      />

      <p className="text-xs text-text-muted font-body leading-relaxed mb-4">
        You can now count the room capacity and assign it to a zone for workspace analysis.
      </p>

      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          className="w-full justify-center"
          icon={<ArrowRight size={14} />}
          iconPosition="right"
          onClick={handleCount}
        >
          Start Room Counting
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          icon={<SlidersHorizontal size={14} />}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}
