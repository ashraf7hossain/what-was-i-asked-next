import { CommentSection } from "@/components/post/comment-section";
import { PostCard } from "@/components/post/post-card";
import { API_ENDPOINTS } from "@/lib/config";

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    // Fetch post data
    const postResponse = await fetch(
      `${API_ENDPOINTS.posts}/${params.id}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      }
    );

    if (!postResponse.ok) {
      throw new Error('Failed to fetch post');
    }

    const postData = await postResponse.json();

    // Fetch comments
    const commentsResponse = await fetch(
      `${API_ENDPOINTS.posts}/${params.id}/comments`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      }
    );

    if (!commentsResponse.ok) {
      throw new Error('Failed to fetch comments');
    }

    const commentData = await commentsResponse.json();

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
              />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
      </div>
    );
  }
}