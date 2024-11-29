'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreatePostModal } from './create-post-modal';
import { PenLine } from 'lucide-react';

export function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = () => {
    if (!session) {
      router.push('/auth/sign-in');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="mb-6">
      <Button
        onClick={handleCreatePost}
        variant="outline"
        className="w-full h-auto py-6 flex gap-2 justify-start text-muted-foreground hover:text-foreground"
      >
        <PenLine className="h-5 w-5" />
        Create Post
      </Button>
      <CreatePostModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}