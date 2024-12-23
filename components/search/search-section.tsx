"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config";
import Link from "next/link";

export function SearchSection() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPosts = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const tags = debouncedQuery.toLowerCase().split(" ").filter(Boolean);
        const data: any = await apiClient.post<any[]>(
          API_ENDPOINTS.search_by_tags,
          {
            tags,
          },
          {
            cache: "no-cache",
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );
        setSuggestions(data.posts);
        setShowSuggestions(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchPosts();
  }, [debouncedQuery]);

  return (
    <div ref={wrapperRef} className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts by tags (space-separated)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (query.trim() || isLoading) && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="text-xl font-semibold hover:underline"
                >
                  <button
                    key={post.id}
                    className="w-full text-left px-4 py-2 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                    onClick={() => {
                      // Handle suggestion click - e.g., navigate to post
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="font-medium truncate">{post.title}</div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {post.tags.join(", ")}
                      </div>
                    )}
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
