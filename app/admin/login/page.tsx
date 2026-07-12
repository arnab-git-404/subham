"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FlaskConical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-ice-blue/50 to-sterile-white p-4 dark:from-dark-base dark:to-dark-base">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-clinical-blue/5 blur-3xl dark:bg-bio-teal/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10">
            <FlaskConical className="h-7 w-7 text-clinical-blue" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Admin Login
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-dark-base/60">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-center text-xs text-alert-coral">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-clinical-blue text-white hover:bg-clinical-blue/90"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-clinical-blue hover:underline"
          >
            Back to Portfolio
          </a>
        </div>
      </motion.div>

      {/* Theme toggle top-right */}
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
