"use client";

import { motion } from "framer-motion";
import { GraduationCap, HeartPulse, Microscope, FlaskConical } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const educationTimeline = [
  {
    year: "2023 - Present",
    title: "Bachelor of Medical Laboratory Technology (BMLT)",
    institution: "3rd Year",
    description:
      "Currently pursuing a degree in Medical Laboratory Technology with focus on clinical diagnostics, hematology, microbiology, and biochemistry.",
  },
];

const interests = [
  {
    icon: Microscope,
    title: "Clinical Diagnostics",
    description: "Passionate about accurate disease diagnosis through laboratory testing and analysis.",
  },
  {
    icon: HeartPulse,
    title: "Hematology",
    description: "Focused on blood-related disorders, complete blood counts, and coagulation studies.",
  },
  {
    icon: FlaskConical,
    title: "Biochemistry",
    description: "Interested in metabolic panels, enzyme assays, and clinical chemistry analysis.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description: "Committed to staying updated with the latest medical laboratory technologies and techniques.",
  },
];

export default function AboutPage() {
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
          <p className="mt-4 text-sm text-muted-foreground">
            BMLT Student | Future Medical Lab Technologist
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <GlassCard>
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-deep-diagnostic dark:text-ice-blue">
                Who I Am
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                I am Subham Das, a dedicated 3rd-year Bachelor of Medical Laboratory 
                Technology (BMLT) student with a deep passion for clinical laboratory 
                science. My academic journey has equipped me with foundational knowledge 
                in hematology, microbiology, clinical biochemistry, and pathology.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                I believe in the power of accurate diagnostics to transform patient care. 
                Through my coursework and hands-on laboratory sessions, I am developing 
                the precision, attention to detail, and analytical thinking required to 
                excel as a medical laboratory technologist.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="mb-8 font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Education
          </h2>
          <div className="space-y-4">
            {educationTimeline.map((item) => (
              <GlassCard key={item.title} hover={false}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clinical-blue/10">
                      <GraduationCap className="h-5 w-5 text-clinical-blue" />
                    </div>
                    <div className="mt-2 h-full w-[1px] bg-gradient-to-b from-clinical-blue/30 to-transparent" />
                  </div>
                  <div className="flex-1 pb-6">
                    <span className="text-xs font-medium text-bio-teal">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.institution}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-8 font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Interests & Focus Areas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {interests.map((item) => (
              <GlassCard key={item.title}>
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10">
                    <item.icon className="h-5 w-5 text-clinical-blue" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
