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

export function PostCard({ post }: { post: Post }) {
  const [votes, setVotes] = useState({
    upVotes: post.upvotes,
    downVotes: post.downvotes,
  });
  const { toast } = useToast();

  const handleVote = async (direction: "up" | "down") => {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.votes,
        { post_id: post.id, value: direction === "up" ? 1 : -1 },
        { requireAuth: true }
      );

      // if (!response.ok) {
      //   if (response.status === 401) {
      //     toast({
      //       title: "Authentication required",
      //       description: "Please sign in to vote",
      //       variant: "destructive",
      //     });
      //     return;
      //   }
      //   throw new Error("Failed to vote");
      // }

      // const newVotes = direction === "up" ? votes + 1 : votes - 1;
      // setVotes();
    } catch (error) {
      console.log("error => ", error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href={`/post/${post.id}`}
            className="text-xl font-semibold hover:underline"
          >
            {post.title}
          </Link>
          <span className="text-sm text-muted-foreground">
            Posted by {post.user_name}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">{post.body}</p>
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
