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
  buildingName: z.string().min(1, "Building name is required"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(1, "Location is required"),
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
      buildingName: project.buildingName || "",
      category: project.category || "",
      location: project.location || "",
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
          label="Project Name"
          placeholder="Oslo HQ Optimisation"
          error={errors.projectName?.message}
          {...register("projectName")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="Building Name"
          placeholder="Aker Brygge Tower"
          error={errors.buildingName?.message}
          {...register("buildingName")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Select
          label="Building Category"
          options={categories}
          placeholder="Select a category…"
          error={errors.category?.message}
          {...register("category")}
        />
      </motion.div>

      <motion.div variants={item}>
        <Input
          label="Location"
          placeholder="e.g. Oslo, Norway"
          error={errors.location?.message}
          {...register("location")}
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
