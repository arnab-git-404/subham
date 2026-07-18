"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save,
  User,
  Link as LinkIcon,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AtSign,
  BookOpen,
  GraduationCap,
  FileText,
  Hash,
  Camera,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/FileUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";
import type { IProfile } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const socialFields = [
  { key: "linkedin", label: "LinkedIn", icon: LinkIcon, placeholder: "https://linkedin.com/in/your-profile" },
  { key: "github", label: "GitHub", icon: LinkIcon, placeholder: "https://github.com/your-username" },
  { key: "instagram", label: "Instagram", icon: LinkIcon, placeholder: "https://instagram.com/your-handle" },
  { key: "facebook", label: "Facebook", icon: LinkIcon, placeholder: "https://facebook.com/your-profile" },
  { key: "email", label: "Email", icon: AtSign, placeholder: "your.email@example.com" },
] as const;

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    tagline: "",
    bio: "",
    year: "",
    institution: "",
    avatarUrl: "",
    skills: [] as string[],
    resumeUrl: "",
    socialLinks: {
      linkedin: "",
      github: "",
      instagram: "",
      facebook: "",
      email: "",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data;
        setForm({
          fullName: p.fullName || "",
          tagline: p.tagline || "",
          bio: p.bio || "",
          year: p.year || "",
          institution: p.institution || "",
          avatarUrl: p.avatarUrl || "",
          skills: p.skills || [],
          resumeUrl: p.resumeUrl || "",
          socialLinks: {
            linkedin: p.socialLinks?.linkedin || "",
            github: p.socialLinks?.github || "",
            instagram: p.socialLinks?.instagram || "",
            facebook: p.socialLinks?.facebook || "",
            email: p.socialLinks?.email || "",
          },
        });
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName || undefined,
          tagline: form.tagline || undefined,
          bio: form.bio || undefined,
          year: form.year || undefined,
          institution: form.institution || undefined,
          avatarUrl: form.avatarUrl || null,
          skills: form.skills.length > 0 ? form.skills : undefined,
          resumeUrl: form.resumeUrl || null,
          socialLinks: {
            linkedin: form.socialLinks.linkedin || null,
            github: form.socialLinks.github || null,
            instagram: form.socialLinks.instagram || null,
            facebook: form.socialLinks.facebook || null,
            email: form.socialLinks.email || null,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "Failed to save profile");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function addSkill() {
    const skill = newSkill.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setNewSkill("");
    }
  }

  function removeSkill(skill: string) {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  }

  function updateSocial(key: string, value: string) {
    setForm({
      ...form,
      socialLinks: { ...form.socialLinks, [key]: value },
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10">
            <User className="h-5 w-5 text-clinical-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
              Profile Setup
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage your personal information, photo, and social links
            </p>
          </div>
        </div>
      </motion.div>

      {/* Avatar Section */}
      <motion.div variants={itemVariants}>
        <GlassCard className="mb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Avatar preview */}
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-border/40 bg-gradient-to-br from-clinical-blue/5 to-bio-teal/5 shadow-md">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
                    <Camera className="h-8 w-8" />
                    <span className="text-[9px]">No photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload area */}
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">Profile Photo</Label>
              <p className="text-xs text-muted-foreground">
                Upload a professional photo. Recommended: 400x400px or square.
              </p>
              <FileUpload
                value={form.avatarUrl}
                onChange={(url) => setForm({ ...form, avatarUrl: url })}
                accept="image/jpeg,image/png,image/webp"
                label="Upload Photo"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={itemVariants}>
        <GlassCard className="mb-6">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
            <User className="h-4 w-4 text-clinical-blue" />
            Personal Information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Subham Das"
                className="bg-white/50 dark:bg-dark-base/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="BMLT Student | Future Medical Lab Technologist"
                className="bg-white/50 dark:bg-dark-base/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell your story — background, passion, and aspirations..."
                rows={4}
                className="resize-none bg-white/50 dark:bg-dark-base/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">
                <GraduationCap className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                Year
              </Label>
              <Input
                id="year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="3rd Year BMLT"
                className="bg-white/50 dark:bg-dark-base/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">
                <BookOpen className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                Institution
              </Label>
              <Input
                id="institution"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="Your College / University"
                className="bg-white/50 dark:bg-dark-base/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Resume / CV
              </Label>
              <p className="text-xs text-muted-foreground">
                Upload your resume as a PDF. It will be downloadable from the homepage.
              </p>
              <FileUpload
                value={form.resumeUrl}
                onChange={(url) => setForm({ ...form, resumeUrl: url })}
                accept="application/pdf"
                label="Upload Resume (PDF)"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Skills */}
      <motion.div variants={itemVariants}>
        <GlassCard className="mb-6">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
            <Hash className="h-4 w-4 text-bio-teal" />
            Skills
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="bg-white/50 dark:bg-dark-base/50"
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="outline"
                className="shrink-0 gap-1.5 border-bio-teal/30 text-bio-teal hover:bg-bio-teal/5"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {form.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="group gap-1.5 bg-bio-teal/10 px-3 py-1.5 text-xs text-bio-teal"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-alert-coral/20 hover:text-alert-coral"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60 italic">
                No skills added yet. Start typing above.
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={itemVariants}>
        <GlassCard className="mb-8">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
            <LinkIcon className="h-4 w-4 text-clinical-blue" />
            Social Links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`social-${key}`}>{label}</Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id={`social-${key}`}
                    value={(form.socialLinks as Record<string, string>)[key]}
                    onChange={(e) => updateSocial(key, e.target.value)}
                    placeholder={placeholder}
                    className="bg-white/50 pl-10 dark:bg-dark-base/50"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Action bar */}
      <motion.div variants={itemVariants} className="sticky bottom-6 z-10">
        <GlassCard className="border-clinical-blue/10 shadow-lg shadow-clinical-blue/5">
          <div className="flex items-center justify-between">
            <div>
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-alert-coral">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </p>
              )}
              {saved && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-500"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Profile saved successfully!
                </motion.p>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "gap-2 px-6 transition-all",
                saved
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-clinical-blue text-white hover:bg-clinical-blue/90"
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
