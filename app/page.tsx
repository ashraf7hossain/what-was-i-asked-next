import { PostCard } from "@/components/post/post-card";
import { Post } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/config";

export default async function Home() {
  const res = await fetch(API_ENDPOINTS.posts, {
    method: "GET"
  });
  const data = await res.json();
  const posts = data.posts

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
