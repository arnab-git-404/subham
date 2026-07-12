"use client";

import { useState } from "react";
import Image from "next/image";
import GlassCard from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Building2, FileText, ImageIcon } from "lucide-react";
import type { ICertificate } from "@/types";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  certificate: ICertificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [open, setOpen] = useState(false);
  const isPDF = certificate.fileType === "pdf";

  return (
    <>
      <GlassCard
        glow
        className="group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-clinical-blue/5 to-bio-teal/5">
            {isPDF ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-clinical-blue/60" />
                  <p className="mt-2 text-xs text-muted-foreground">PDF Document</p>
                </div>
              </div>
            ) : (
              <Image
                src={certificate.fileUrl}
                alt={certificate.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Featured badge */}
            {certificate.featured && (
              <Badge className="absolute right-2 top-2 bg-bio-teal/90 text-white shadow-lg backdrop-blur-sm">
                Featured
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                {certificate.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="line-clamp-1">{certificate.issuer}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge
                variant="secondary"
                className="text-[10px] capitalize"
              >
                {certificate.category}
              </Badge>
              {certificate.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-xl text-deep-diagnostic dark:text-ice-blue">
            {certificate.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              {/* Full image/PDF */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-clinical-blue/5 to-bio-teal/5">
                {isPDF ? (
                  <div className="flex h-full items-center justify-center">
                    <FileText className="h-16 w-16 text-clinical-blue/40" />
                  </div>
                ) : (
                  <Image
                    src={certificate.fileUrl}
                    alt={certificate.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>

              <div className="grid gap-3 text-sm">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Issuer
                  </span>
                  <p className="text-foreground">{certificate.issuer}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Issue Date
                  </span>
                  <p className="text-foreground">
                    {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {certificate.description && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Description
                    </span>
                    <p className="text-foreground">{certificate.description}</p>
                  </div>
                )}
                {certificate.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {certificate.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
