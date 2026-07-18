"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Award,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, ICertificate } from "@/types";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Certificate",
    issuer: "",
    issueDate: "",
    description: "",
    fileUrl: "",
    fileType: "image" as "image" | "pdf",
    tags: "",
    featured: false,
    order: 0,
  });

  async function fetchCertificates() {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates");
      const data: ApiResponse<ICertificate[]> = await res.json();
      if (data.success && data.data) setCertificates(data.data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  function resetForm() {
    setFormData({
      title: "",
      category: "Certificate",
      issuer: "",
      issueDate: "",
      description: "",
      fileUrl: "",
      fileType: "image",
      tags: "",
      featured: false,
      order: 0,
    });
    setEditId(null);
  }

  function openEdit(cert: ICertificate) {
    setFormData({
      title: cert.title,
      category: cert.category,
      issuer: cert.issuer,
      issueDate: cert.issueDate.split("T")[0],
      description: cert.description || "",
      fileUrl: cert.fileUrl,
      fileType: cert.fileType,
      tags: cert.tags.join(", "),
      featured: cert.featured,
      order: cert.order,
    });
    setEditId(cert._id);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = editId
        ? `/api/certificates/${editId}`
        : "/api/certificates";
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
        fetchCertificates();
      }
    } catch (err) {
      console.error("Failed to save certificate:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCertificates();
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Certificates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your certificates and achievements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchCertificates}
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
            Add Certificate
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : certificates.length === 0 ? (
        <GlassCard className="text-center">
          <Award className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            No certificates yet. Add your first one!
          </p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Issuer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {cert.order}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-1">{cert.title}</span>
                      {cert.featured && (
                        <Badge variant="secondary" className="text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs capitalize">
                      {cert.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-sm lg:table-cell">
                    {cert.issuer}
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(cert)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-alert-coral hover:text-alert-coral"
                        onClick={() => handleDelete(cert._id)}
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
              {editId ? "Edit Certificate" : "Add Certificate"}
            </DialogTitle>
            <DialogDescription>
              {editId
                ? "Update the certificate details below."
                : "Fill in the certificate information."}
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
                <Label htmlFor="order">Order *</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  required
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Certificate", "Workshop", "Internship", "Award"].map(
                      (cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select
                  value={formData.fileType}
                  onValueChange={(v: "image" | "pdf") =>
                    setFormData({ ...formData, fileType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer *</Label>
              <Input
                id="issuer"
                required
                value={formData.issuer}
                onChange={(e) =>
                  setFormData({ ...formData, issuer: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate File *</Label>
              <FileUpload
                value={formData.fileUrl}
                onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                label="Upload Certificate"
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
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="hematology, clinical, lab"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-clinical-blue"
              />
              <Label htmlFor="featured" className="text-sm">
                Featured certificate
              </Label>
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
