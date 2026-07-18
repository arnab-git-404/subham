"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Microscope } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, IProfile } from "@/types";

export default function AboutPage() {
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

  const p = profile;

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
            About{" "}
            <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
              Me
            </span>
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          {p?.tagline && (
            <p className="mt-4 text-sm text-muted-foreground">
              {p.tagline}
            </p>
          )}
        </motion.div>

        {/* Avatar + Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <GlassCard>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              {p?.avatarUrl && (
                <div className="shrink-0">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-white/40 shadow-xl">
                    <img
                      src={p.avatarUrl}
                      alt={p.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-deep-diagnostic dark:text-ice-blue">
                  {p?.fullName || "About"}
                </h2>
                {p?.bio && (
                  <>
                    <p className="leading-relaxed text-muted-foreground">
                      {p.bio}
                    </p>
                  </>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Current Study */}
        {(p?.institution || p?.year) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="mb-8 font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
              Education
            </h2>
            <GlassCard hover={false}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clinical-blue/10">
                    <GraduationCap className="h-5 w-5 text-clinical-blue" />
                  </div>
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
                    {p.institution}
                  </h3>
                  {p.year && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.year}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                    Pursuing education in Medical Laboratory Technology with focus on clinical diagnostics, hematology, microbiology, and biochemistry.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Skills as Interest Areas */}
        {p?.skills && p.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-8 font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
              Skills & Focus Areas
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {p.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <GlassCard>
                    <div className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10">
                        <Microscope className="h-5 w-5 text-clinical-blue" />
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                        {skill}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Professional competency in {skill.toLowerCase()}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
