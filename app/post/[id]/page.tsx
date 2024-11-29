import { CommentSection } from "@/components/post/comment-section";
import { PostCard } from "@/components/post/post-card";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config";
import { useSession } from "next-auth/react";

export default async function PostPage({ params }: { params: { id: string } }) {
  const postData = await apiClient.get<any>(
    API_ENDPOINTS.posts + "/" + params.id,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cahce",
      },
    }
  );

  const commentData = await apiClient.get<any>(
    API_ENDPOINTS.posts + "/" + params.id + "/comments"
  );

  const post = postData.post[0];
  const comments = commentData.comments;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <PostCard post={post} />
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <CommentSection
              comments={comments}
              postId={params.id}
              user={null}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
