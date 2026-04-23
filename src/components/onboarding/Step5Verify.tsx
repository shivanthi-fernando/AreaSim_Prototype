"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, CheckCircle2, RefreshCw, ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";
import { cn } from "@/lib/utils";

interface Props {
  onNext: () => void;
  onBack: () => void;
  onReupload: () => void;
}

export function Step5Verify({ onNext, onBack, onReupload }: Props) {
  const { floors, setVerificationFile } = useOnboardingStore();

  // Only show floors that have an uploaded file
  const uploadedFloors = floors.filter((f) => f.file);
  const [selectedId, setSelectedId] = useState(uploadedFloors[0]?.id ?? "");
  const [zoom, setZoom] = useState(1);

  const selectedFloor = uploadedFloors.find((f) => f.id === selectedId) ?? uploadedFloors[0];
  const clampedZoom = Math.min(3, Math.max(0.5, zoom));

  const handleVerify = () => {
    if (selectedFloor?.file) {
      setVerificationFile({ name: selectedFloor.file.name, preview: selectedFloor.file.preview });
    }
    onNext();
  };

  if (uploadedFloors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <p className="text-sm text-text-muted font-body text-center py-8">
          No floor plans uploaded yet. Go back and upload at least one.
        </p>
        <Button variant="secondary" size="lg" onClick={onBack} icon={<ArrowLeft size={15} />} className="w-full">
          Back
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <p className="text-xs text-text-muted font-body">
        Select a floor plan to verify before continuing. We&apos;ll use this to kick off your canvas.
      </p>

      {/* Floor selector pills */}
      {uploadedFloors.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFloors.map((f) => (
            <button
              key={f.id}
              onClick={() => { setSelectedId(f.id); setZoom(1); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-body border transition-all",
                selectedId === f.id
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-surface-2 text-text-muted border-border hover:border-primary/40 hover:text-text"
              )}
            >
              <Layers size={11} />
              {f.name}
              {selectedId === f.id && <CheckCircle2 size={11} className="ml-0.5" />}
            </button>
          ))}
        </div>
      )}

      {/* Image viewer */}
      <div className="relative rounded-2xl border border-border bg-surface-2 overflow-hidden h-64 flex items-center justify-center">
        {selectedFloor?.file?.preview ? (
          <motion.div
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            className="cursor-grab active:cursor-grabbing"
            style={{ scale: clampedZoom }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFloor.file.preview}
              alt="Floor plan preview"
              className="max-h-56 max-w-full rounded-xl object-contain select-none"
              draggable={false}
            />
          </motion.div>
        ) : (
          <div className="text-center text-text-muted font-body px-4">
            <Layers size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">{selectedFloor?.name}</p>
            <p className="text-xs mt-1">PDF files cannot be previewed</p>
          </div>
        )}

        {/* Floor label badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          <Layers size={9} /> {selectedFloor?.name}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-1">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-2 transition-colors">
            <ZoomOut size={13} />
          </button>
          <span className="text-xs font-mono text-text-muted px-1" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            {Math.round(clampedZoom * 100)}%
          </span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-2 transition-colors">
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {selectedFloor?.file && (
        <p className="text-xs text-text-muted font-body text-center">
          <span className="font-medium text-text">{selectedFloor.file.name}</span> — drag to pan, use zoom controls
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="lg" onClick={onReupload} icon={<RefreshCw size={15} />} className="w-full">
          Re-upload
        </Button>
        <Button size="lg" onClick={handleVerify} icon={<CheckCircle2 size={15} />} className="w-full">
          Looks Correct
        </Button>
      </div>

      <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={15} />} className="w-full">
        Back
      </Button>
    </motion.div>
  );
}
