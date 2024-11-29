"use client";

import { Comment, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config";
import { useSession } from "next-auth/react";

export function CommentSection({
  comments: initialComments,
  postId,
}: {
  comments: Comment[];
  postId: string;
}) {
  const { data: session, status } = useSession(); // Use `data` for session
  const user = session?.user || null;
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.comment,
        { post_id: +postId, body: newComment },
        { requireAuth: true }
      );

      const comment = {
        id       : Math.random().toString(),
        body     : newComment,
        user_id  : user.id,
        user_name: user.name,
        post_id  : postId,
        createdAt: new Date().toISOString(),
        upvotes  : 0,
        downvotes: 0,
      };

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (commentId: string, direction: "up" | "down") => {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.comment_vote,
        { comment_id: commentId, value: direction === "up" ? 1 : -1 },
        { requireAuth: true }
      );
    } catch (error) {
      console.log("error => ", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Comment</Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-4 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{comment.user_name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-2">{comment.body}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "up")}
              >
                <ArrowBigUp className="h-4 w-4" />
              </Button>
              <span>{comment.upvotes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "down")}
              >
                <ArrowBigDown className="h-4 w-4" />
              </Button>
              <span>{comment.downvotes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
