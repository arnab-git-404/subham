"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Award,
  CalendarDays,
  MessageSquare,
  User,
  LogOut,
  FlaskConical,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/workshops", label: "Workshops", icon: CalendarDays },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // Check auth status
  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/profile")
        .then((res) => {
          if (res.status === 401) {
            setLoggedIn(false);
            router.push("/admin/login");
          }
        })
        .catch(() => {
          setLoggedIn(false);
          router.push("/admin/login");
        });
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-sterile-white dark:bg-dark-base">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-white/80 backdrop-blur-xl transition-transform dark:bg-dark-base/80",
          "max-md:-translate-x-full",
          sidebarOpen && "max-md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-border/50 px-6 py-4">
          <FlaskConical className="h-5 w-5 text-bio-teal" />
          <span className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
            Admin Panel
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-4">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                pathname.startsWith(href)
                  ? "bg-clinical-blue/10 text-clinical-blue dark:bg-clinical-blue/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout + Theme */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-alert-coral"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="mt-3 block text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-border/50 bg-white/80 px-4 py-3 backdrop-blur-xl md:hidden dark:bg-dark-base/80">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
          Admin Panel
        </span>
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="p-4 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
