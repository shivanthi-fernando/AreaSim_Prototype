"use client";

import { useState } from "react";
import { Plus, Trash2, Upload, Check, AlertCircle, X, ChevronRight, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useOnboardingStore, Floor } from "@/store/onboarding";
import { cn } from "@/lib/utils";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3FloorPlans({ onNext, onBack }: Props) {
  const { floors, addFloor, removeFloor, updateFloor } = useOnboardingStore();
  const [verifyingFloor, setVerifyingFloor] = useState<Floor | null>(null);

  const handleAddFloor = () => {
    const newId = (floors.length + 1).toString();
    addFloor({
      id: newId,
      name: `Floor ${floors.length + 1}`,
      level: (floors.length + 1).toString(),
    });
  };

  const handleFileChange = (floorId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    const floor = floors.find(f => f.id === floorId);
    if (!floor) return;

    const updatedFloor = {
      ...floor,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
      }
    };
    
    updateFloor(floorId, updatedFloor);
    setVerifyingFloor(updatedFloor);
  };

  const handleVerify = () => {
    if (verifyingFloor) {
      setVerifyingFloor(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {floors.map((floor, index) => (
          <motion.div
            key={floor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Floor Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text tracking-wider" style={{ fontFamily: "var(--font-manrope)" }}>Floor {index + 1}</h3>
                  {floors.length > 1 && (
                    <button
                      onClick={() => removeFloor(floor.id)}
                      className="text-text-muted hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    label="Floor name"
                    placeholder="e.g. Ground Floor"
                    value={floor.name}
                    onChange={(e) => updateFloor(floor.id, { name: e.target.value })}
                  />
                  {floor.file && (
                    <div className="pt-1 space-y-0.5">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-wider">This floor plan is verified</p>
                      <p className="text-[10px] text-text-muted">8 rooms were identified</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <p className="text-sm font-medium text-text mb-2">Floor plan</p>
                {floor.file ? (
                  <div className="relative aspect-[4/3] rounded-xl border border-border overflow-hidden bg-surface-2 group/image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={floor.file.preview}
                      alt={floor.name}
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white"
                        onClick={() => setVerifyingFloor(floor)}
                      >
                        Verify
                      </Button>
                      <label className="cursor-pointer">
                        <div className="h-9 px-4 rounded-xl bg-white text-text text-sm font-medium flex items-center justify-center hover:bg-surface-2 transition-colors">
                          Change
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(floor.id, e)}
                        />
                      </label>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-accent/90 text-white px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider">
                      <CheckCircle2 size={10} />
                      Verified
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-text-muted" />
                    </div>
                    <p className="text-sm font-medium text-text">Upload floor plan</p>
                    <p className="text-xs text-text-muted mt-1">Jpg, Png or Pdf</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(floor.id, e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Floor Button */}
      <button
        onClick={handleAddFloor}
        className="w-full py-6 rounded-2xl border-2 border-dashed border-border text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/[0.02] transition-all flex items-center justify-center gap-2 group"
      >
        <Plus size={20} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium">Add floor</span>
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={onBack}
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={floors.some(f => !f.file)}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue
        </Button>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {verifyingFloor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-text/60 backdrop-blur-sm"
              onClick={() => setVerifyingFloor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{verifyingFloor.name}</h2>
                  <p className="text-sm text-text-muted">Verify the floor plan layout</p>
                </div>
                <button
                  onClick={() => setVerifyingFloor(null)}
                  className="p-2 rounded-lg hover:bg-surface-2 text-text-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto bg-surface-2 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-border p-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={verifyingFloor.file?.preview}
                    alt={verifyingFloor.name}
                    className="w-full h-auto"
                  />
                  
                  {/* AI Detection HUD Overlay (Mock) */}
                  <div className="absolute inset-0 pointer-events-none p-4">
                    <div className="w-full h-full border-2 border-accent/30 rounded-lg relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-accent/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {/* Random detection boxes */}
                      <div className="absolute top-[20%] left-[10%] w-[15%] h-[20%] border border-accent bg-accent/10 rounded" />
                      <div className="absolute top-[20%] left-[28%] w-[12%] h-[20%] border border-accent bg-accent/10 rounded" />
                      <div className="absolute top-[50%] left-[40%] w-[40%] h-[30%] border border-accent bg-accent/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-accent">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">AI detected 8 rooms automatically</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setVerifyingFloor(null)}>
                    Re-upload
                  </Button>
                  <Button icon={<Check size={18} />} onClick={handleVerify}>
                    Verify this floor plan
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
