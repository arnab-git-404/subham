"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Check,
  Trash2,
  RefreshCw,
  Inbox,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ApiResponse, IMessage } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("unread");

  async function fetchMessages() {
    setLoading(true);
    try {
      const params = filter === "unread" ? "?read=false" : "";
      const res = await fetch(`/api/messages${params}`);
      const data: ApiResponse<IMessage[]> = await res.json();
      if (data.success && data.data) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-deep-diagnostic dark:text-ice-blue">
            Messages
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-clinical-blue text-white" : ""}
          >
            Unread
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-clinical-blue text-white" : ""}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMessages}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <GlassCard className="text-center">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">No messages found.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassCard
                hover={false}
                className={cn(
                  "transition-all",
                  !msg.read && "border-l-2 border-l-clinical-blue"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-deep-diagnostic dark:text-ice-blue">
                        {msg.name}
                      </span>
                      <Badge
                        variant={msg.read ? "outline" : "default"}
                        className={
                          msg.read
                            ? "text-[10px]"
                            : "bg-clinical-blue/10 text-clinical-blue text-[10px]"
                        }
                      >
                        {msg.read ? "Read" : "New"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {msg.email}
                      </span>
                      {msg.subject && (
                        <span className="text-foreground/60">
                          Subject: {msg.subject}
                        </span>
                      )}
                      <span>
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!msg.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-bio-teal"
                        onClick={() => markAsRead(msg._id)}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-alert-coral"
                      title="Delete (todo)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
