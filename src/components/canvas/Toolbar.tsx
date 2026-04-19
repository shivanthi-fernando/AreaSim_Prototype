"use client";

import { MousePointer2, PenLine, Layers, Group, Eraser } from "lucide-react";
import { motion } from "framer-motion";
import { useCanvasStore } from "@/store/canvas";
import { cn } from "@/lib/utils";

type Tool = "select" | "pen" | "zone" | "group" | "eraser";

const tools: { id: Tool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pen", icon: PenLine, label: "Draw Room", shortcut: "P" },
  { id: "zone", icon: Layers, label: "Draw Zone", shortcut: "Z" },
  { id: "group", icon: Group, label: "Group", shortcut: "G" },
  { id: "eraser", icon: Eraser, label: "Erase", shortcut: "E" },
];

export function Toolbar() {
  const { activeTool, setTool } = useCanvasStore();

  return (
    <div className="flex flex-col items-center gap-1 py-3 px-2">
      <div className="w-0.5 h-0 mb-1" />
      {tools.map(({ id, icon: Icon, label, shortcut }) => {
        const active = activeTool === id;
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTool(id)}
            title={`${label} (${shortcut})`}
            className={cn(
              "group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150",
              active
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "text-text-muted hover:bg-surface-2 hover:text-text"
            )}
          >
            <Icon size={18} />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 whitespace-nowrap rounded-lg border border-border bg-surface px-2 py-1 text-xs font-body text-text shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {label}
              <span className="ml-1.5 text-text-muted font-mono">{shortcut}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
