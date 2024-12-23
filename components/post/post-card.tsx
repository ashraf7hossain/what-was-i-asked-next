"use client";

import { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { ThreeDotEdit } from "../ui/three-dot-edit";
import { EditPostModal } from "./post-edit-modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { PostTags } from "./post-tags";

const MAX_TITLE_LENGTH = 50;
const MAX_PREVIEW_LENGTH = 200;

export function PostCard({ post }: { post: Post }) {
  const { data: session } = useSession();

  const [votes, setVotes] = useState({
    upVotes: post.upvotes,
    downVotes: post.downvotes,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [isExpanded, setIsExpanded] = useState(false);

  const { toast } = useToast();

  const isAuthor = (session?.user as any)?.id === post.user_id;

  const truncatedTitle =
    currentPost.title.length > MAX_TITLE_LENGTH
      ? `${currentPost.title.slice(0, MAX_TITLE_LENGTH)}...`
      : currentPost.title;

  const truncatedBody =
    currentPost.body.length > MAX_PREVIEW_LENGTH
      ? `${currentPost.body.slice(0, MAX_PREVIEW_LENGTH)}...`
      : currentPost.body;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVote = async (direction: "up" | "down") => {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.votes,
        { post_id: post.id, value: direction === "up" ? 1 : -1 },
        { requireAuth: true }
      );
      // const newVotes = direction === "up" ? votes + 1 : votes - 1;
      setVotes(() => {
        return {
          upVotes: votes.upVotes + (direction === "up" ? 1 : 0),
          downVotes: votes.downVotes + (direction === "down" ? 1 : 0),
        };
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  const onEdit = async () => {
    setIsEditModalOpen(true);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href={`/post/${currentPost.id}`}
            className="text-xl font-semibold hover:underline"
          >
            {truncatedTitle}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Posted by {currentPost.user_name}
            </span>
            {isAuthor && (
              <ThreeDotEdit
                endpoint={`${API_ENDPOINTS.posts}/${currentPost.id}`}
                onEdit={onEdit}
              />
            )}
            <EditPostModal
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              post={currentPost}
            />
          </div>
        </div>
        <PostTags tags={currentPost.tags || []} />
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "prose prose-sm max-w-none",
            !isExpanded && "line-clamp-3"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {isExpanded ? currentPost.body : truncatedBody}
          </ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleVote("up")}>
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          <span>{post.upvotes}</span>
          <Button variant="ghost" size="sm" onClick={() => handleVote("down")}>
            <ArrowBigDown className="h-5 w-5" />
          </Button>
          <span>{post.downvotes}</span>
        </div>
        <Link href={`/post/${post.id}`}>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
