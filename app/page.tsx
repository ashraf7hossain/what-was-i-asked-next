import { PostCard } from "@/components/post/post-card";
import { Post } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";
import { CreatePost } from "@/components/post/create-post";
import { SearchSection } from "@/components/search/search-section";

export default async function Home() {
  const data = await apiClient.get<any>(API_ENDPOINTS.posts + "/", {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cahce",
    },
  });
  const posts = data.posts;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <SearchSection/>
          <CreatePost />
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
