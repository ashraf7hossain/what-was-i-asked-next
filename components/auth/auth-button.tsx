'use client';

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();

  const handleAuth = async () => {
    if (session) {
      await signOut();
    } else {
      await signIn();
    }
  };

  return (
    <Button onClick={handleAuth} variant="outline">
      {session ? 'Sign Out' : 'Sign In'}
    </Button>
  );
}