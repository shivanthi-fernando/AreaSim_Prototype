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
export function RoomModal({ room, floorId, onClose }: RoomModalProps) {
  const { updateRoom, deleteRoom } = useCanvasStore();
  const [formData, setFormData] = useState({
    name: room.name,
    sqm: room.sqm || 0,
    category: room.category || "Meeting Room",
    seats: room.seats || 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerify = () => {
    updateRoom(floorId, room.id, {
      ...formData,
      verified: true,
      status: "unvisited" // Ensure it's ready for counting but verified
    });
    onClose();
  };

  const handleDelete = () => {
    deleteRoom(floorId, room.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="w-80 rounded-2xl border border-border bg-white shadow-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text font-display uppercase tracking-wider">Verify Room</h3>
        <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 block">Room Name</label>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text focus:outline-none focus:border-accent transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* SQM */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 block">Square Meters</label>
            <input
              type="number"
              value={formData.sqm}
              onChange={(e) => handleChange("sqm", parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text focus:outline-none focus:border-accent transition-all"
            />
          </div>
          {/* Seats */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 block">No. of Seats</label>
            <input
              type="number"
              value={formData.seats}
              onChange={(e) => handleChange("seats", parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text focus:outline-none focus:border-accent transition-all"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 block">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text focus:outline-none focus:border-accent transition-all appearance-none"
          >
            <option>Meeting Room</option>
            <option>Open Office</option>
            <option>Break Room</option>
            <option>Reception</option>
            <option>Focus Pod</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <Button
          onClick={handleVerify}
          className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-11"
        >
          Verify
        </Button>
        <button
          onClick={handleDelete}
          className="w-full text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-2"
        >
          Delete room
        </button>
      </div>
    </motion.div>
  );
}
