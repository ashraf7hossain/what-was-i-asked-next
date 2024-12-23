'use client';

import { Badge } from '@/components/ui/badge';

interface PostTagsProps {
  tags: string[];
}

export function PostTags({ tags }: PostTagsProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs font-normal hover:bg-secondary/80 cursor-pointer"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}