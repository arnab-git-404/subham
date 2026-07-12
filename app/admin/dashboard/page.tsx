"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Award, CalendarDays, MessageSquare, ArrowRight, Plus } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import type { ApiResponse, ICertificate, IWorkshop, IMessage } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    certificates: 0,
    workshops: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [certsRes, workshopsRes, messagesRes] = await Promise.all([
          fetch("/api/certificates"),
          fetch("/api/workshops"),
          fetch("/api/messages?read=false"),
        ]);

        const certs: ApiResponse<ICertificate[]> = await certsRes.json();
        const workshops: ApiResponse<IWorkshop[]> = await workshopsRes.json();
        const messages: ApiResponse<IMessage[]> = await messagesRes.json();

        setStats({
          certificates: certs.data?.length ?? 0,
          workshops: workshops.data?.length ?? 0,
          unreadMessages: messages.data?.length ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Certificates",
      value: stats.certificates,
      icon: Award,
      href: "/admin/certificates",
      color: "text-clinical-blue",
      bg: "bg-clinical-blue/10",
    },
    {
      label: "Workshops",
      value: stats.workshops,
      icon: CalendarDays,
      href: "/admin/workshops",
      color: "text-bio-teal",
      bg: "bg-bio-teal/10",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      href: "/admin/messages",
      color: stats.unreadMessages > 0 ? "text-alert-coral" : "text-muted-foreground",
      bg: stats.unreadMessages > 0 ? "bg-alert-coral/10" : "bg-muted",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href}>
              <GlassCard hover className="group">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-clinical-blue" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <GlassCard hover={false}>
        <h2 className="mb-4 font-heading text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/certificates">
            <Button className="gap-2 bg-clinical-blue text-white hover:bg-clinical-blue/90">
              <Plus className="h-4 w-4" />
              Add Certificate
            </Button>
          </Link>
          <Link href="/admin/workshops">
            <Button
              variant="outline"
              className="gap-2 border-bio-teal/30 text-bio-teal hover:bg-bio-teal/5"
            >
              <Plus className="h-4 w-4" />
              Add Workshop
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              View Public Site
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
