"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={cn(
        "rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all",
        "dark:border-white/5 dark:bg-dark-base/60 dark:shadow-[0_0_30px_rgba(0,180,216,0.05)]",
        glow &&
          "hover:border-bio-teal/30 hover:shadow-[0_0_20px_rgba(0,180,216,0.2)] dark:hover:shadow-[0_0_30px_rgba(0,180,216,0.15)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
