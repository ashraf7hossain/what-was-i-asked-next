'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const startProgress = () => {
      setIsNavigating(true);
      setProgress(0);
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    };

    const finishProgress = () => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
    };

    startProgress();
    finishProgress();

    return () => {
      clearInterval(progressInterval);
    };
  }, [pathname, searchParams]);

  if (!isNavigating) return null;

  return (
    <Progress 
      value={progress} 
      className="fixed top-0 left-0 right-0 z-50 h-[8px] rounded-none bg-transparent [&>div]:bg-blue-500" 
    />
  );
}