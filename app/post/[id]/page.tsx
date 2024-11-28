import { CommentSection } from "@/components/post/comment-section";
import { PostCard } from "@/components/post/post-card";
import { API_ENDPOINTS } from "@/lib/config";



export default async function PostPage({ params }: { params: { id: string } }) {
  const postRes = await fetch(API_ENDPOINTS.posts + '/' + params.id);
  const commentRes = await fetch(API_ENDPOINTS.posts + '/' + params.id + '/comments');
  const postData = await postRes.json();
  const commentData = await commentRes.json();
  const post = postData.post[0]
  const comments = commentData.comments

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