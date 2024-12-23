"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient, ApiError } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config";
import { Textarea } from "../ui/textarea";
import { Comment } from "@/lib/types";

interface EditCommentModalProps {
  open: boolean;
  comment: Comment;
  onOpenChange: (open: boolean) => void;
}

export function EditCommentModal({
  open,
  onOpenChange,
  comment,
}: EditCommentModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState(comment.body);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.patch<any>(
        API_ENDPOINTS.comment + "/" + comment.id,
        {
          body: content,
        },
        { requireAuth: true }
      );
      onOpenChange(false);
      router.refresh();
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to update post";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit this comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
