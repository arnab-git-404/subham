"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Mail,
  Microscope,
  FlaskConical,
  Dna,
  HeartPulse,
  CalendarDays,
  ChevronDown,
  User,
  GraduationCap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/GlassCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { ApiResponse, IProfile, ICertificate, IWorkshop } from "@/types";

const Scene3D = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
  loading: () => null,
});

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const skillTags = [
  "Hematology", "Microbiology", "Clinical Biochemistry",
  "Clinical Pathology", "Lab Safety", "Equipment Handling",
  "Blood Banking", "Quality Control", "Molecular Diagnostics",
];

const featuredCertificates = [
  {
    title: "Basic Hematology Techniques",
    issuer: "IAMLT",
    category: "Certificate",
    color: "from-clinical-blue to-bio-teal",
  },
  {
    title: "Clinical Microbiology Workshop",
    issuer: "National Institute of Microbiology",
    category: "Workshop",
    color: "from-bio-teal to-clinical-blue",
  },
  {
    title: "Lab Safety & Quality Control",
    issuer: "World Health Organization",
    category: "Certificate",
    color: "from-clinical-blue to-bio-teal",
  },
];

const workshops = [
  {
    title: "Hands-on Training in Clinical Biochemistry",
    organizer: "University Hospital Laboratory",
    date: "Aug 2025",
    skills: ["Biochemistry", "Autoanalyzer", "LFT"],
  },
  {
    title: "National Conference on Medical Lab Science",
    organizer: "Indian Medical Laboratory Association",
    date: "Apr 2025",
    skills: ["Lab Management", "Molecular Diagnostics"],
  },
  {
    title: "Blood Bank Technology & Transfusion Medicine",
    organizer: "Regional Blood Transfusion Centre",
    date: "Dec 2024",
    skills: ["Blood Grouping", "Cross-matching"],
  },
];

export default function Home() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [stats, setStats] = useState({ certificates: 0, workshops: 0, skills: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, certsRes, workshopsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/certificates"),
          fetch("/api/workshops"),
        ]);

        const profileData: ApiResponse<IProfile> = await profileRes.json();
        if (profileData.success && profileData.data) {
          setProfile(profileData.data);
          setStats({
            certificates: 0,
            workshops: 0,
            skills: profileData.data.skills?.length ?? 0,
          });
        }

        const certsData: ApiResponse<ICertificate[]> = await certsRes.json();
        const workshopsData: ApiResponse<IWorkshop[]> = await workshopsRes.json();

        setStats((prev) => ({
          ...prev,
          certificates: certsData.data?.length ?? 0,
          workshops: workshopsData.data?.length ?? 0,
        }));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchData();
  }, []);

  const p = profile;
  const nameParts = p?.fullName?.split(" ") ?? ["Subham", "Kaibarta"];
  const firstName = nameParts[0] ?? "Subham";
  const lastName = nameParts.slice(1).join(" ") ?? "Kaibarta";
  const taglineParts = p?.tagline?.split("|") ?? ["BMLT Student", "Future Medical Lab Technologist"];
  const taglineStart = taglineParts[0]?.trim() ?? "BMLT Student";
  const taglineEnd = taglineParts.slice(1).join(" | ").trim() || "Future Medical Lab Technologist";
  const displaySkills = p?.skills?.length ? p.skills : skillTags;

  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-ice-blue/40 via-sterile-white to-sterile-white dark:from-dark-base dark:via-dark-base/98 dark:to-dark-base" />
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-clinical-blue/8 via-bio-teal/5 to-transparent blur-3xl dark:from-clinical-blue/15 dark:via-bio-teal/8" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-bio-teal/3 blur-[120px] dark:bg-bio-teal/5" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-clinical-blue/3 blur-[100px] dark:bg-clinical-blue/8" />

        {/* Hero content overlay */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl space-y-8"
          >
            {/* Avatar + Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="flex flex-col items-center gap-4"
            >
              {/* Profile photo */}
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-white/40 shadow-xl shadow-clinical-blue/10 ring-2 ring-clinical-blue/20">
                  {p?.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={p.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-clinical-blue/20 to-bio-teal/20">
                      <User className="h-10 w-10 text-clinical-blue/40" />
                    </div>
                  )}
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-bio-teal/20 bg-white/40 px-4 py-1.5 text-xs font-medium text-bio-teal shadow-sm backdrop-blur-md dark:bg-dark-base/40">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bio-teal opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-bio-teal" />
                </span>
                {p?.year || "3rd Year BMLT Student"}
              </span>
            </motion.div>

            {/* Main heading */}
            <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="text-deep-diagnostic dark:text-ice-blue">
                {firstName}
              </span>{" "}
              <span className="bg-gradient-to-r from-clinical-blue via-bio-teal to-clinical-blue bg-clip-text text-transparent">
                {lastName}
              </span>
            </h1>

            {/* Animated tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              <span className="inline-block bg-gradient-to-r from-clinical-blue/80 to-bio-teal/80 bg-clip-text text-transparent font-medium">
                {taglineStart}
              </span>{" "}
              | {taglineEnd}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground/70"
            >
              {p?.bio || "Precision meets passion — dedicated to clinical diagnostics, laboratory science, and advancing healthcare through accurate testing."}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
            >
              <Link href="/certificates">
                <Button className="group relative h-12 gap-2 overflow-hidden rounded-xl bg-clinical-blue px-8 text-white shadow-lg shadow-clinical-blue/25 transition-all hover:shadow-xl hover:shadow-clinical-blue/30">
                  <span className="absolute inset-0 bg-gradient-to-r from-bio-teal/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <Award className="relative h-4 w-4" />
                  <span className="relative">View Certificates</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="group h-12 gap-2 rounded-xl border-bio-teal/30 px-8 text-foreground backdrop-blur-sm transition-all hover:border-bio-teal/60 hover:bg-bio-teal/5 hover:shadow-[0_0_20px_rgba(0,180,216,0.15)]"
                >
                  <Mail className="h-4 w-4 transition-all group-hover:text-bio-teal" />
                  <span>Get in Touch</span>
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex justify-center gap-10 pt-6"
            >
              {[
                { icon: Award, label: "Certificates", value: stats.certificates },
                { icon: CalendarDays, label: "Workshops", value: stats.workshops },
                { icon: Microscope, label: "Skills", value: stats.skills },
              ].map((stat) => (
                <div key={stat.label} className="group text-center">
                  <stat.icon className="mx-auto h-4 w-4 text-clinical-blue/60 transition-all group-hover:text-bio-teal dark:text-bio-teal/60" />
                  <div className="mt-1.5 text-xl font-bold text-deep-diagnostic dark:text-ice-blue">
                    {stat.value}{stat.value > 0 ? "+" : ""}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
                Explore
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ ABOUT / BIO SECTION ============ */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sterile-white via-ice-blue/20 to-sterile-white dark:from-dark-base dark:via-dark-base/95 dark:to-dark-base" />

        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-clinical-blue/10 px-3 py-1 text-xs text-clinical-blue"
            >
              <User className="mr-1 h-3 w-3" /> About Me
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
              Who{" "}
              <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
                I Am
              </span>
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-20 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard glow className="h-full">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10">
                    <GraduationCap className="h-6 w-6 text-clinical-blue" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-deep-diagnostic dark:text-ice-blue">
                    Dedicated BMLT Student
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p?.bio?.split(".")[0] || "I'm a passionate 3rd-year Bachelor of Medical Laboratory Technology student with a deep commitment to clinical laboratory science."}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground/70">
                    {p?.bio?.split(".").slice(1).join(".").trim() || "From hematology to molecular diagnostics, building the skills needed to excel as a future Medical Lab Technologist."}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 text-xs font-medium text-clinical-blue transition-colors hover:text-bio-teal"
                  >
                    Read more <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-4"
            >
              {[
                {
                  icon: Microscope,
                  title: "Clinical Diagnostics",
                  desc: "Expertise in diagnostic testing and result interpretation",
                },
                {
                  icon: HeartPulse,
                  title: "Hematology",
                  desc: "Blood cell analysis, coagulation studies, and CBC interpretation",
                },
                {
                  icon: FlaskConical,
                  title: "Biochemistry",
                  desc: "Metabolic panels, enzyme assays, and clinical chemistry",
                },
              ].map((item) => (
                <GlassCard key={item.title} glow className="group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10 transition-all group-hover:from-clinical-blue/20 group-hover:to-bio-teal/20">
                      <item.icon className="h-5 w-5 text-clinical-blue transition-all group-hover:text-bio-teal" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SKILLS SPOTLIGHT ============ */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sterile-white via-white to-sterile-white dark:from-dark-base dark:via-[#0D1F35] dark:to-dark-base" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-bio-teal/3 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-bio-teal/10 px-3 py-1 text-xs text-bio-teal"
            >
              <Dna className="mr-1 h-3 w-3" /> My Toolkit
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
              Skills &{" "}
              <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
                Competencies
              </span>
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-20 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: { transition: { staggerChildren: 0.05 } },
            }}
            className="flex flex-wrap justify-center gap-3"
          >
            {displaySkills.map((skill) => (
              <motion.div
                key={skill}
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <span className="inline-block cursor-default rounded-full border border-bio-teal/20 bg-white/50 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-bio-teal/40 hover:bg-bio-teal/5 hover:shadow-[0_0_15px_rgba(0,180,216,0.15)] dark:bg-dark-base/50 dark:hover:bg-dark-base/70">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="mt-10 text-center">
            <Link href="/skills">
              <Button
                variant="outline"
                className="gap-2 border-clinical-blue/30 text-clinical-blue hover:bg-clinical-blue/5"
              >
                View All Skills
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED CERTIFICATES ============ */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sterile-white via-ice-blue/20 to-sterile-white dark:from-dark-base dark:via-dark-base/95 dark:to-dark-base" />

        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-clinical-blue/10 px-3 py-1 text-xs text-clinical-blue"
            >
              <Award className="mr-1 h-3 w-3" /> Achievements
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
                Certificates
              </span>
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-20 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCertificates.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <GlassCard glow className="group h-full">
                  <div className="space-y-4">
                    {/* Gradient decoration bar */}
                    <div
                      className={`h-1.5 w-full rounded-full bg-gradient-to-r ${cert.color} opacity-60`}
                    />
                    <Badge
                      variant="outline"
                      className="border-clinical-blue/20 text-[10px] text-clinical-blue"
                    >
                      {cert.category}
                    </Badge>
                    <h3 className="font-heading text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/certificates"
                        className="inline-flex items-center gap-1 text-xs font-medium text-clinical-blue transition-all group-hover:text-bio-teal"
                      >
                        View Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 text-center">
            <Link href="/certificates">
              <Button className="gap-2 bg-clinical-blue text-white shadow-lg shadow-clinical-blue/20 hover:bg-clinical-blue/90 hover:shadow-xl hover:shadow-clinical-blue/30">
                View All Certificates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ LATEST WORKSHOPS ============ */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sterile-white via-white to-sterile-white dark:from-dark-base dark:via-[#0D1F35] dark:to-dark-base" />
        <div className="absolute left-0 top-1/3 h-[300px] w-[300px] rounded-full bg-clinical-blue/3 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-bio-teal/10 px-3 py-1 text-xs text-bio-teal"
            >
              <CalendarDays className="mr-1 h-3 w-3" /> Events
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
              Workshops{" "}
              <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
                Attended
              </span>
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-20 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          </motion.div>

          <div className="space-y-4">
            {workshops.map((ws, i) => (
              <motion.div
                key={ws.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard glow className="group">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-bio-teal">
                          {ws.date}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                        {ws.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {ws.organizer}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:shrink-0">
                      {ws.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-bio-teal/20 text-[9px] text-bio-teal"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 text-center">
            <Link href="/workshops">
              <Button
                variant="outline"
                className="gap-2 border-bio-teal/30 text-bio-teal hover:bg-bio-teal/5"
              >
                View All Workshops
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="relative py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-sterile-white via-ice-blue/30 to-sterile-white dark:from-dark-base dark:via-dark-base/90 dark:to-dark-base" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-clinical-blue/8 via-bio-teal/5 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <motion.div {...fadeUp} className="space-y-6">
            <Badge
              variant="secondary"
              className="bg-clinical-blue/10 px-3 py-1 text-xs text-clinical-blue"
            >
              Let&apos;s Connect
            </Badge>

            <h2 className="font-heading text-3xl font-bold text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
              Ready to{" "}
              <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
                Collaborate
              </span>
              ?
            </h2>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
              Whether you&apos;re looking for a dedicated lab professional, have 
              a question about my work, or want to discuss opportunities — 
              I&apos;d love to hear from you.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 gap-2 rounded-xl bg-clinical-blue px-8 text-white shadow-lg shadow-clinical-blue/25 transition-all hover:bg-clinical-blue/90 hover:shadow-xl hover:shadow-clinical-blue/30">
                  <Mail className="h-4 w-4" />
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="/documents/resume.pdf"
                download
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-bio-teal/30 px-8 text-sm font-medium text-bio-teal backdrop-blur-sm transition-all hover:bg-bio-teal/5 hover:shadow-[0_0_20px_rgba(0,180,216,0.15)]"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
