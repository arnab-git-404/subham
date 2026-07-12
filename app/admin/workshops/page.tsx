"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, IWorkshop } from "@/types";

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    date: "",
    location: "",
    description: "",
    certificateFileUrl: "",
    skillsGained: "",
  });

  async function fetchWorkshops() {
    setLoading(true);
    try {
      const res = await fetch("/api/workshops");
      const data: ApiResponse<IWorkshop[]> = await res.json();
      if (data.success && data.data) setWorkshops(data.data);
    } catch (err) {
      console.error("Failed to fetch workshops:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkshops();
  }, []);

  function resetForm() {
    setFormData({
      title: "",
      organizer: "",
      date: "",
      location: "",
      description: "",
      certificateFileUrl: "",
      skillsGained: "",
    });
    setEditId(null);
  }

  function openEdit(ws: IWorkshop) {
    setFormData({
      title: ws.title,
      organizer: ws.organizer,
      date: ws.date.split("T")[0],
      location: ws.location || "",
      description: ws.description || "",
      certificateFileUrl: ws.certificateFileUrl || "",
      skillsGained: ws.skillsGained.join(", "),
    });
    setEditId(ws._id);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...formData,
      skillsGained: formData.skillsGained
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editId ? `/api/workshops/${editId}` : "/api/workshops";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        resetForm();
        fetchWorkshops();
      }
    } catch (err) {
      console.error("Failed to save workshop:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this workshop?")) return;
    try {
      const res = await fetch(`/api/workshops/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchWorkshops();
    } catch (err) {
      console.error("Failed to delete workshop:", err);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Workshops
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage workshops and events attended
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchWorkshops}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            className="gap-2 bg-clinical-blue text-white hover:bg-clinical-blue/90"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Workshop
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : workshops.length === 0 ? (
        <GlassCard className="text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            No workshops yet. Add your first one!
          </p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Organizer</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((ws) => (
                <TableRow key={ws._id}>
                  <TableCell className="font-medium">
                    <span className="line-clamp-1">{ws.title}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {ws.organizer}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {ws.location || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(ws.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(ws)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-alert-coral hover:text-alert-coral"
                        onClick={() => handleDelete(ws._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Workshop" : "Add Workshop"}
            </DialogTitle>
            <DialogDescription>
              {editId
                ? "Update the workshop details below."
                : "Fill in the workshop information."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  required
                  value={formData.organizer}
                  onChange={(e) =>
                    setFormData({ ...formData, organizer: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateFileUrl">Certificate File URL</Label>
              <Input
                id="certificateFileUrl"
                type="url"
                placeholder="https://..."
                value={formData.certificateFileUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certificateFileUrl: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillsGained">
                Skills Gained (comma-separated)
              </Label>
              <Input
                id="skillsGained"
                placeholder="microscopy, staining, analysis"
                value={formData.skillsGained}
                onChange={(e) =>
                  setFormData({ ...formData, skillsGained: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-clinical-blue text-white hover:bg-clinical-blue/90"
              >
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
