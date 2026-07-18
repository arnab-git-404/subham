"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Microscope } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, IProfile } from "@/types";

export default function SkillsPage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data: ApiResponse<IProfile> = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const skills = profile?.skills ?? [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-28">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
            Skills &{" "}
            <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
              Competencies
            </span>
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          <p className="mt-4 text-sm text-muted-foreground">
            Technical and professional skills developed through academic training and hands-on experience
          </p>
        </motion.div>

        {skills.length === 0 ? (
          <GlassCard className="text-center">
            <Microscope className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              No skills added yet. Check back soon!
            </p>
          </GlassCard>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {skills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard glow className="group h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10 transition-all group-hover:from-clinical-blue/20 group-hover:to-bio-teal/20">
                      <Microscope className="h-5 w-5 text-clinical-blue transition-all group-hover:text-bio-teal" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                        {skill}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-clinical-blue/10">
                          <div className="h-full w-full rounded-full bg-gradient-to-r from-clinical-blue to-bio-teal" />
                        </div>
                        <span className="text-[10px] font-medium text-bio-teal">
                          Proficient
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
