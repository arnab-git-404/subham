"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Filter } from "lucide-react";
import CertificateCard from "@/components/CertificateCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import GlassCard from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import type { ICertificate, ApiResponse } from "@/types";

const categories = ["All", "Certificate", "Workshop", "Internship", "Award"];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const params = activeCategory !== "All" ? `?category=${activeCategory}` : "";
        const res = await fetch(`/api/certificates${params}`);
        const data: ApiResponse<ICertificate[]> = await res.json();
        if (data.success && data.data) {
          setCertificates(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, [activeCategory]);

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
              Certificates
            </span>{" "}
            & Achievements
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-16 bg-gradient-to-r from-clinical-blue to-bio-teal" />
          <p className="mt-4 text-sm text-muted-foreground">
            Professional certifications, workshops, and academic achievements
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                activeCategory === cat
                  ? "bg-clinical-blue text-white hover:bg-clinical-blue/90"
                  : "hover:border-clinical-blue/50 hover:text-clinical-blue"
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setLoading(true);
              }}
            >
              {cat === "All" ? "All" : cat}
            </Badge>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : certificates.length === 0 ? (
          <GlassCard className="text-center">
            <Award className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              No certificates found in this category.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CertificateCard certificate={cert} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
