"use client";

import { useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2, GripVertical, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Floors({ onNext, onBack }: Props) {
  const { floors, setFloors, addFloor, removeFloor, updateFloor } = useOnboardingStore();
  const [error, setError] = useState("");

  const handleAdd = () => {
    const id = Date.now().toString();
    addFloor({ id, name: "", level: `${floors.length}` });
  };

  const handleNext = () => {
    if (floors.length === 0) {
      setError("Add at least one floor to continue.");
      return;
    }
    const hasEmpty = floors.some((f) => !f.name.trim());
    if (hasEmpty) {
      setError("Please name all floors before continuing.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="space-y-5">
      <Reorder.Group
        axis="y"
        values={floors}
        onReorder={setFloors}
        className="space-y-3"
      >
        <AnimatePresence>
          {floors.map((floor, i) => (
            <Reorder.Item
              key={floor.id}
              value={floor}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={16} className="text-text-muted shrink-0" />

              <div className="flex-1 min-w-0">
                <input
                  value={floor.name}
                  onChange={(e) => updateFloor(floor.id, { name: e.target.value })}
                  placeholder={`e.g. Ground Floor, Level ${i + 1}, Basement…`}
                  className="w-full bg-transparent text-sm font-medium text-text font-body focus:outline-none placeholder:text-text-muted/50"
                  autoFocus={i === floors.length - 1 && !floor.name}
                />
              </div>

              <button
                onClick={() => removeFloor(floor.id)}
                disabled={floors.length === 1}
                className="text-text-muted hover:text-accent-warm transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 size={15} />
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add floor */}
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm text-text-muted hover:border-primary hover:text-primary transition-all duration-200 font-body"
      >
        <Plus size={16} />
        Add Floor
      </button>

      {error && (
        <p className="text-xs text-accent-warm font-body">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button size="lg" className="flex-1" onClick={handleNext} icon={<ArrowRight size={16} />} iconPosition="right">
          Continue
        </Button>
      </div>
    </div>
  );
}
