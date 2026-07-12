"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import WorkshopCard from "@/components/WorkshopCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import GlassCard from "@/components/GlassCard";
import type { IWorkshop, ApiResponse } from "@/types";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const res = await fetch("/api/workshops");
        const data: ApiResponse<IWorkshop[]> = await res.json();
        if (data.success && data.data) {
          setWorkshops(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, []);

  // Group workshops by year
  const groupedWorkshops = workshops.reduce<
    Record<number, IWorkshop[]>
  >((acc, workshop) => {
    const year = new Date(workshop.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(workshop);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedWorkshops)
    .map(Number)
    .sort((a, b) => b - a);

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
            <span className="bg-gradient-to-r from-clinical-blue to-bio-teal bg-clip-text text-transparent">
              Workshops
            </span>{" "}
            & Events
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          <p className="mt-4 text-sm text-muted-foreground">
            Workshops, seminars, and professional development events attended
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : workshops.length === 0 ? (
          <GlassCard className="text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              No workshops attended yet. Check back soon!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="mb-6 font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
                  {year}
                </h2>
                <div className="space-y-4">
                  {groupedWorkshops[year].map((workshop, i) => (
                    <motion.div
                      key={workshop._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <WorkshopCard workshop={workshop} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
