"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X, Upload, File, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";

interface UploadedFile {
  name: string;
  preview?: string;
  type: string;
  size: number;
}

interface FloorMapping {
  id: string;
  floorId: string;
  file: UploadedFile | null;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function MiniUpload({
  onFile,
  file,
  onClear,
}: {
  onFile: (f: UploadedFile) => void;
  file: UploadedFile | null;
  onClear: () => void;
}) {
  const [dragging, setDragging] = useState(false);

  const process = useCallback((rawFiles: FileList) => {
    const f = rawFiles[0];
    if (!f) return;
    const uploaded: UploadedFile = { name: f.name, type: f.type, size: f.size };
    if (f.type.startsWith("image/")) uploaded.preview = URL.createObjectURL(f);
    onFile(uploaded);
  }, [onFile]);

  if (file) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
        {file.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.preview} alt={file.name} className="w-8 h-8 rounded-lg object-cover border border-border shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border shrink-0">
            {file.type.startsWith("image/") ? <ImageIcon size={14} className="text-text-muted" /> : <File size={14} className="text-text-muted" />}
          </div>
        )}
        <span className="text-xs font-body text-text truncate flex-1">{file.name}</span>
        <button onClick={onClear} className="shrink-0 text-text-muted hover:text-accent-warm transition-colors">
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={() => setDragging(true)}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); process(e.dataTransfer.files); }}
      onClick={() => {
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "image/jpeg,image/png,.pdf";
        inp.onchange = (e) => { const t = e.target as HTMLInputElement; if (t.files) process(t.files); };
        inp.click();
      }}
      className={`flex items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2 cursor-pointer transition-all ${
        dragging ? "border-accent bg-accent/5" : "border-border hover:border-primary/50 hover:bg-surface-2"
      }`}
    >
      <Upload size={14} className={dragging ? "text-accent" : "text-text-muted"} />
      <span className="text-xs font-body text-text-muted">
        {dragging ? "Drop here" : "Click or drop floor plan (JPG, PNG, PDF)"}
      </span>
    </div>
  );
}

export function Step4Upload({ onNext, onBack }: Props) {
  const { floors, updateFloor, setVerificationFile } = useOnboardingStore();

  // Initialise one mapping row per floor
  const [mappings, setMappings] = useState<FloorMapping[]>(
    floors.map((f) => ({ id: f.id, floorId: f.id, file: f.file ? { name: f.file.name, preview: f.file.preview, type: f.file.type, size: f.file.size } : null }))
  );
  const [error, setError] = useState("");

  const usedFloorIds = mappings.map((m) => m.floorId);
  const availableFloors = floors.filter((f) => !usedFloorIds.includes(f.id));

  const updateMapping = (id: string, patch: Partial<FloorMapping>) =>
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const addRow = () => {
    if (availableFloors.length === 0) return;
    setMappings((prev) => [
      ...prev,
      { id: `map-${Date.now()}`, floorId: availableFloors[0].id, file: null },
    ]);
  };

  const removeRow = (id: string) =>
    setMappings((prev) => prev.filter((m) => m.id !== id));

  const handleNext = () => {
    const filled = mappings.filter((m) => m.file);
    if (filled.length === 0) {
      setError("Please upload at least one floor plan.");
      return;
    }
    // Save each uploaded file to its floor in the store
    mappings.forEach((m) => {
      if (m.file) {
        updateFloor(m.floorId, {
          file: { name: m.file.name, preview: m.file.preview, type: m.file.type, size: m.file.size },
        });
      }
    });
    // Set the first uploaded file as the verification starting point
    const first = filled[0];
    setVerificationFile({ name: first.file!.name, preview: first.file!.preview });
    setError("");
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <p className="text-xs text-text-muted font-body leading-relaxed">
        Upload a floor plan for each floor. You can upload now and add more later.
      </p>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {mappings.map((mapping, i) => {
            const floorName = floors.find((f) => f.id === mapping.floorId)?.name ?? "Floor";
            // Floors available for this dropdown = all floors not used by OTHER rows
            const selectableFloors = floors.filter(
              (f) => f.id === mapping.floorId || !mappings.some((m) => m.id !== mapping.id && m.floorId === f.id)
            );

            return (
              <motion.div
                key={mapping.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border bg-surface-2 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <select
                      value={mapping.floorId}
                      onChange={(e) => updateMapping(mapping.id, { floorId: e.target.value })}
                      className="text-xs font-semibold text-text bg-transparent outline-none cursor-pointer font-body"
                    >
                      {selectableFloors.map((f) => (
                        <option key={f.id} value={f.id}>{f.name} ({f.level})</option>
                      ))}
                    </select>
                  </div>
                  {mappings.length > 1 && (
                    <button onClick={() => removeRow(mapping.id)}
                      className="text-text-muted hover:text-accent-warm transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <MiniUpload
                  file={mapping.file}
                  onFile={(f) => updateMapping(mapping.id, { file: f })}
                  onClear={() => updateMapping(mapping.id, { file: null })}
                />

                {mapping.file && (
                  <p className="text-[10px] text-accent font-body font-semibold">
                    ✓ {floorName} floor plan uploaded
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {availableFloors.length > 0 && (
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs text-primary font-semibold font-body hover:underline"
        >
          <Plus size={13} /> Add another floor plan
        </button>
      )}

      {error && <p className="text-xs text-accent-warm font-body">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button size="lg" className="flex-1" onClick={handleNext} icon={<ArrowRight size={16} />} iconPosition="right">
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
