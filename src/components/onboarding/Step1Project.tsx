"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/onboarding";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  officeAddress: z.string().min(1, "Office address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  category: z.string().min(1, "Please select a category"),
  industry: z.string().min(1, "Please select an industry"),
});

type FormValues = z.infer<typeof schema>;

const categories = [
  { value: "office", label: "Office" },
  { value: "coworking", label: "Co-working" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const industries = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Banking" },
  { value: "creative", label: "Creative & Media" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional Services" },
  { value: "other", label: "Other" },
];

interface Props {
  onNext: () => void;
}

export function Step1Project({ onNext }: Props) {
  const { project, setProject } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectName: project.projectName || "",
      officeAddress: project.officeAddress || "",
      postalCode: project.postalCode || "",
      category: project.category || "",
      industry: project.industry || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setProject(data);
    onNext();
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <motion.div variants={item}>
        <Input
          label="Project name"
          placeholder="Oslo HQ optimisation"
          error={errors.projectName?.message}
          {...register("projectName")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="Office address"
          placeholder="Aker Brygge Tower, Oslo"
          error={errors.officeAddress?.message}
          {...register("officeAddress")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="Postal code"
          placeholder="0123"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Select
          label="Building category"
          options={categories}
          placeholder="Select a category…"
          error={errors.category?.message}
          {...register("category")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Select
          label="Industry"
          options={industries}
          placeholder="Select an industry…"
          error={errors.industry?.message}
          {...register("industry")}
        />
      </motion.div>

      <motion.div variants={item} className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue
        </Button>
      </motion.div>
    </motion.form>
  );
}
