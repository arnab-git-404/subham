import { FlaskConical, Link2, Code2, Briefcase, Camera, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/20 bg-white/50 backdrop-blur-lg dark:border-white/5 dark:bg-dark-base/50">
      {/* Top gradient line */}
      <div className="mx-auto h-[2px] w-full max-w-7xl bg-gradient-to-r from-transparent via-bio-teal/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-bio-teal" />
              <span className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                Subham Das
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              BMLT Student | Future Medical Lab Technologist
              <br />
              Passionate about clinical diagnostics and laboratory science.
            </p>
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
              {[
                { icon: Briefcase, href: "#", label: "LinkedIn" },
                { icon: Code2, href: "#", label: "GitHub" },
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Mail, href: "mailto:#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/50 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-bio-teal/30 hover:text-bio-teal hover:shadow-[0_0_12px_rgba(0,180,216,0.3)] dark:border-white/10 dark:bg-dark-base/50"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Subham Das. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
