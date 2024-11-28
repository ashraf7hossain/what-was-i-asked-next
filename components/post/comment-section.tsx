'use client';

import { Comment, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CommentSection({ 
  comments: initialComments,
  postId,
  user
}: { 
  comments: Comment[],
  postId: string,
  user: User | null
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const response = await fetch('/api/protected/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please sign in to comment",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Failed to add comment');
      }

      const comment = {
        id: Math.random().toString(),
        content: newComment,
        authorId: user.id,
        author: user,
        postId,
        createdAt: new Date().toISOString(),
        votes: 0
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

  const handleVote = async (commentId: string, direction: 'up' | 'down') => {
    try {
      const response = await fetch('/api/protected/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          direction,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please sign in to vote",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Failed to vote');
      }

      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            votes: direction === 'up' ? comment.votes + 1 : comment.votes - 1
          };
        }
        return comment;
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register vote",
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
        {comments.map((comment) => (
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
                onClick={() => handleVote(comment.id, 'up')}
              >
                <ArrowBigUp className="h-4 w-4" />
              </Button>
              <span>{comment.votes}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, 'down')}
              >
                <ArrowBigDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}