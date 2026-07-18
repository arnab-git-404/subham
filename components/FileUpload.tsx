"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: string;
  onChange: (url: string, publicId?: string) => void;
  accept?: string;
  label?: string;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/jpeg,image/png,image/gif,image/webp,application/pdf",
  label = "Upload File",
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.data.url, data.data.publicId);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleRemove() {
    onChange("", undefined);
  }

  const isPdf = value.toLowerCase().endsWith(".pdf");

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl border border-border/50 bg-white/50 dark:bg-dark-base/50"
          >
            {/* Preview */}
            <div className="flex items-center gap-3 p-3">
              {isPdf ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-alert-coral/10">
                  <FileText className="h-6 w-6 text-alert-coral" />
                </div>
              ) : (
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={value}
                    alt="Uploaded file preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).classList.add("hidden");
                    }}
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {isPdf ? "PDF Document" : "Image uploaded"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {isPdf ? "Certificate document" : "Click to view full size"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-alert-coral/10 hover:text-alert-coral"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Upload new overlay */}
            <label className="flex cursor-pointer items-center justify-center border-t border-border/30 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-dark-base/80">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Replace file
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </motion.div>
        </AnimatePresence>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all",
            dragActive
              ? "border-clinical-blue bg-clinical-blue/5"
              : "border-border/50 hover:border-clinical-blue/50 hover:bg-white/30 dark:hover:bg-dark-base/30"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-clinical-blue" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-clinical-blue/10">
                <Upload className="h-5 w-5 text-clinical-blue" />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drop a file here or click to browse
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                JPG, PNG, GIF, WebP or PDF (max 5MB)
              </p>
            </>
          )}
        </label>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-alert-coral"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
