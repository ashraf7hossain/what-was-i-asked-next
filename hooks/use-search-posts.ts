'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';


export function useSearchPosts(query: string, tags: string[]) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterPosts = async () => {
      setIsLoading(true);
      tags = query.split(' ');
      try {
        let filteredPosts= await apiClient.post<any[]>(`/search/tags?`,
          { tags },
        );
        

        // Filter by search query
        // if (query) {
        //   const searchTerms = query.toLowerCase().split(' ');
        //   filteredPosts = filteredPosts.filter(post =>
        //     searchTerms.every(term =>
        //       post.title.toLowerCase().includes(term) ||
        //       post.body.toLowerCase().includes(term)
        //     )
        //   );
        // }

        // Filter by tags
        // if (tags.length > 0) {
        //   filteredPosts = filteredPosts.filter(post =>
        //     tags.every(tag => post.tags?.includes(tag))
        //   );
        // }

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterPosts();
  }, [query, tags]);

  return { posts, isLoading };
}