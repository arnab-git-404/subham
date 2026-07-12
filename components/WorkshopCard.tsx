"use client";

import GlassCard from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";
import type { IWorkshop } from "@/types";

interface WorkshopCardProps {
  workshop: IWorkshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <GlassCard glow>
      <div className="space-y-3">
        {/* Date badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="bg-clinical-blue/10 text-clinical-blue"
          >
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(workshop.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>

        <h3 className="text-base font-semibold text-deep-diagnostic dark:text-ice-blue">
          {workshop.title}
        </h3>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            <span>{workshop.organizer}</span>
          </div>
          {workshop.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span>{workshop.location}</span>
            </div>
          )}
        </div>

        {workshop.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {workshop.description}
          </p>
        )}

        {workshop.skillsGained.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {workshop.skillsGained.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-bio-teal/20 text-[10px] text-bio-teal"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
