"use client";

import { motion } from "framer-motion";
import {
  Microscope,
  FlaskConical,
  Dna,
  HeartPulse,
  Shield,
  Beaker,
  Users,
  Clock,
  Search,
  BookOpen,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";

const skillCategories = [
  {
    title: "Laboratory Skills",
    skills: [
      { name: "Hematology", icon: HeartPulse, level: "Advanced" },
      { name: "Microbiology", icon: Microscope, level: "Advanced" },
      { name: "Clinical Biochemistry", icon: FlaskConical, level: "Intermediate" },
      { name: "Clinical Pathology", icon: Dna, level: "Intermediate" },
      { name: "Lab Safety Protocols", icon: Shield, level: "Advanced" },
      { name: "Equipment Handling", icon: Beaker, level: "Intermediate" },
    ],
  },
  {
    title: "Soft Skills",
    skills: [
      { name: "Attention to Detail", icon: Search, level: "Advanced" },
      { name: "Time Management", icon: Clock, level: "Advanced" },
      { name: "Team Collaboration", icon: Users, level: "Intermediate" },
      { name: "Continuous Learning", icon: BookOpen, level: "Advanced" },
    ],
  },
];

export default function SkillsPage() {
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

        {/* Skill Categories */}
        <div className="space-y-12">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.2 }}
            >
              <h2 className="mb-6 font-heading text-xl font-bold text-deep-diagnostic dark:text-ice-blue">
                {category.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.2 + skillIndex * 0.1 }}
                  >
                    <GlassCard glow className="group h-full">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10 transition-all group-hover:from-clinical-blue/20 group-hover:to-bio-teal/20">
                          <skill.icon className="h-5 w-5 text-clinical-blue transition-all group-hover:text-bio-teal" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                            {skill.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-clinical-blue/10">
                              <div
                                className={`h-full rounded-full ${
                                  skill.level === "Advanced"
                                    ? "w-full bg-gradient-to-r from-clinical-blue to-bio-teal"
                                    : "w-2/3 bg-gradient-to-r from-clinical-blue/70 to-bio-teal/70"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-medium ${
                                skill.level === "Advanced"
                                  ? "text-bio-teal"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
