"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Briefcase, Code2, Camera, Mail, Download } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, IProfile } from "@/types";

const socialProfiles = [
  { key: "linkedin", label: "LinkedIn", icon: Briefcase, color: "hover:text-[#0077B5]" },
  { key: "github", label: "GitHub", icon: Code2, color: "hover:text-foreground" },
  { key: "instagram", label: "Instagram", icon: Camera, color: "hover:text-[#E4405F]" },
  { key: "email", label: "Email", icon: Mail, color: "hover:text-bio-teal" },
] as const;

export default function ContactPage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: ApiResponse<IProfile>) => {
        if (data.success && data.data) {
          setProfile(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const links = profile?.socialLinks ?? {};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
          className="mb-12 text-center"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-deep-diagnostic dark:text-ice-blue sm:text-4xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          <p className="mt-4 text-sm text-muted-foreground">
            Have a question or want to connect? Drop me a message.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard hover={false}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bio-teal/10">
                    <Send className="h-6 w-6 text-bio-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-deep-diagnostic dark:text-ice-blue">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-alert-coral">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gap-2 bg-clinical-blue text-white hover:bg-clinical-blue/90"
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </GlassCard>
          </motion.div>

          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Resume download */}
            {profile?.resumeUrl && (
              <GlassCard>
                <div className="space-y-3">
                  <h3 className="font-heading text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
                    Download Resume
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Get a detailed overview of my education, skills, and experience.
                  </p>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-bio-teal/30 px-4 py-2 text-sm font-medium text-bio-teal transition-all hover:bg-bio-teal/5 hover:shadow-[0_0_12px_rgba(0,180,216,0.15)]"
                  >
                    <Download className="h-4 w-4" />
                    Download CV / Resume
                  </a>
                </div>
              </GlassCard>
            )}

            {/* Social links */}
            {Object.values(links).some(Boolean) && (
              <GlassCard>
                <div className="space-y-4">
                  <h3 className="font-heading text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
                    Connect With Me
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialProfiles.map(({ key, label, icon: Icon, color }) => {
                      const href = (links as Record<string, string>)[key];
                      if (!href) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 rounded-xl border border-white/20 bg-white/30 p-3 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-bio-teal/30 hover:shadow-[0_0_12px_rgba(0,180,216,0.15)] dark:border-white/10 dark:bg-dark-base/30 ${color}`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="hidden sm:inline">{label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Email contact */}
            {links.email && (
              <GlassCard>
                <div className="space-y-3 text-sm">
                  <h3 className="font-heading text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
                    Direct Contact
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    For urgent inquiries, feel free to reach out directly via email.
                  </p>
                  <a
                    href={`mailto:${links.email}`}
                    className="inline-flex items-center gap-2 text-sm text-clinical-blue transition-colors hover:text-bio-teal"
                  >
                    <Mail className="h-4 w-4" />
                    {links.email}
                  </a>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
