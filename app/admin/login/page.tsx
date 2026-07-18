"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";

type AuthMode = "login" | "signup";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login"
        ? { email, password }
        : { email, password, confirmPassword };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(newMode: AuthMode) {
    if (newMode === mode) return;
    setMode(newMode);
    resetForm();
  }

  const isLogin = mode === "login";

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
            {isLogin ? "Admin Login" : "Create Account"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {isLogin
              ? "Sign in to manage your portfolio"
              : "Register a new admin account"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex rounded-xl border border-border/50 bg-white/40 p-1 backdrop-blur-sm dark:bg-dark-base/40">
          <button
            onClick={() => switchMode("login")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              isLogin
                ? "bg-clinical-blue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              !isLogin
                ? "bg-bio-teal text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-dark-base/60">
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isLogin ? "Enter your password" : "Create a password (min. 8 chars)"
                    }
                    required
                    className="pl-9 pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      required
                      className="pl-9 pr-9"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-center text-xs text-alert-coral"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full gap-2 ${
                  isLogin
                    ? "bg-clinical-blue text-white hover:bg-clinical-blue/90"
                    : "bg-bio-teal text-white hover:bg-bio-teal/90"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : isLogin ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>
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
