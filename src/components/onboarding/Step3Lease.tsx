"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore, LeaseParams } from "@/store/onboarding";

const schema = z.object({
  totalArea: z.string().min(1, "Total area is required"),
  annualRent: z.string().min(1, "Annual rent is required"),
  commonAreaCost: z.string().min(1, "Common area cost is required"),
  targetHeadcount: z.number().min(1, "At least 1 person required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Lease({ onNext, onBack }: Props) {
  const { leaseParams, setLeaseParams } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      totalArea: leaseParams.totalArea || "",
      annualRent: leaseParams.annualRent || "",
      commonAreaCost: leaseParams.commonAreaCost || "",
      targetHeadcount: leaseParams.targetHeadcount || 1,
    },
  });

  const headcount = watch("targetHeadcount");

  const adjust = (delta: number) => {
    const next = Math.max(1, (headcount || 1) + delta);
    setValue("targetHeadcount", next);
  };

  const onSubmit = (data: FormValues) => {
    setLeaseParams(data as LeaseParams);
    onNext();
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <motion.form
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Total Area (SqFt)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 10,000"
              className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-14 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register("totalArea")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-mono">
              SqFt
            </span>
          </div>
          {errors.totalArea && <p className="text-xs text-accent-warm font-body">{errors.totalArea.message}</p>}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Annual Rent Cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted font-mono pointer-events-none">
              NOK
            </span>
            <input
              type="number"
              placeholder="e.g. 2,500,000"
              className="w-full rounded-[10px] border border-border bg-surface pl-14 pr-4 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register("annualRent")}
            />
          </div>
          {errors.annualRent && <p className="text-xs text-accent-warm font-body">{errors.annualRent.message}</p>}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Common Area Cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted font-mono pointer-events-none">
              NOK
            </span>
            <input
              type="number"
              placeholder="e.g. 400,000"
              className="w-full rounded-[10px] border border-border bg-surface pl-14 pr-4 py-2.5 text-sm text-text font-body placeholder:text-text-muted/60 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register("commonAreaCost")}
            />
          </div>
          {errors.commonAreaCost && <p className="text-xs text-accent-warm font-body">{errors.commonAreaCost.message}</p>}
        </div>
      </motion.div>

      {/* Headcount stepper */}
      <motion.div variants={item}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text font-body">Target Headcount</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjust(-1)}
              className="w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-text hover:bg-surface-2 transition-colors"
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 rounded-[10px] border border-border bg-surface py-2.5 text-center">
              <span className="text-lg font-semibold text-text font-mono" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                {headcount || 1}
              </span>
              <span className="text-sm text-text-muted font-body ml-2">people</span>
            </div>
            <button
              type="button"
              onClick={() => adjust(1)}
              className="w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-text hover:bg-surface-2 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex gap-3 pt-2">
        <Button variant="secondary" size="lg" type="button" className="flex-1" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button size="lg" type="submit" className="flex-1" icon={<ArrowRight size={16} />} iconPosition="right">
          Continue
        </Button>
      </motion.div>
    </motion.form>
  );
}
