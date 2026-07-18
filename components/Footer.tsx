"use client";

import { useEffect, useState } from "react";
import { FlaskConical, Code2, Briefcase, Camera, Mail } from "lucide-react";
import Link from "next/link";

interface ProfileData {
  fullName?: string;
  tagline?: string;
  avatarUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    email?: string;
  };
}

const socialConfig = [
  { key: "linkedin" as const, icon: Briefcase, label: "LinkedIn" },
  { key: "github" as const, icon: Code2, label: "GitHub" },
  { key: "instagram" as const, icon: Camera, label: "Instagram" },
  { key: "email" as const, icon: Mail, label: "Email" },
];

export default function Footer() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfile(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const links = profile?.socialLinks ?? {};
  const name = profile?.fullName || "Portfolio";
  const tagline = profile?.tagline || "";

  return (
    <footer className="relative mt-auto border-t border-white/20 bg-white/50 backdrop-blur-lg dark:border-white/5 dark:bg-dark-base/50">
      {/* Top gradient line */}
      <div className="mx-auto h-[2px] w-full max-w-7xl bg-gradient-to-r from-transparent via-bio-teal/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              {profile?.avatarUrl ? (
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <img src={profile.avatarUrl} alt={name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <FlaskConical className="h-5 w-5 text-bio-teal" />
              )}
              <span className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                {name}
              </span>
            </Link>
            {tagline && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/about", label: "About" },
                { href: "/certificates", label: "Certificates" },
                { href: "/workshops", label: "Workshops" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-clinical-blue"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialConfig.map(({ key, icon: Icon, label }) => {
                const href = links[key];
                if (!href) return null;
                return (
                  <a
                    key={key}
                    href={key === "email" ? `mailto:${href}` : href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/50 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-bio-teal/30 hover:text-bio-teal hover:shadow-[0_0_12px_rgba(0,180,216,0.3)] dark:border-white/10 dark:bg-dark-base/50"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {name}. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
