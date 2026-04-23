"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ fullName: "", company: "", email: "" });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    sessionStorage.setItem("signup-email", values.email);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/verify-email");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-700 text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
          Create your account
        </h1>
        <p className="text-sm text-text-muted font-body">
          Start your workspace intelligence journey — free for 30 days.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <Input label="Full name" placeholder="Ingrid Larsen" icon={<User size={16} />}
            value={values.fullName} onChange={handleChange("fullName")} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input label="Company" placeholder="Larsen & Partners AS" icon={<Building2 size={16} />}
            value={values.company} onChange={handleChange("company")} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input label="Work email" type="email" placeholder="ingrid@company.no" icon={<Mail size={16} />}
            value={values.email} onChange={handleChange("email")} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" loading={loading}
            icon={<ArrowRight size={16} />} iconPosition="right">
            Continue with email
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants}>
        <div className="relative flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted font-body">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <button className="w-full flex items-center justify-center gap-3 rounded-[10px] border border-border bg-surface py-2.5 text-sm font-medium text-text font-body hover:bg-surface-2 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </motion.div>

      <motion.p variants={itemVariants} className="text-center text-sm text-text-muted font-body">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
      </motion.p>
    </motion.div>
  );
}
