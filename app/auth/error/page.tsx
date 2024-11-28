"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          Authentication Error
        </h1>
        <p className="text-muted-foreground">
          {error === "Configuration" &&
            "There is a problem with the server configuration."}
          {error === "AccessDenied" && "You do not have permission to sign in."}
          {error === "Verification" && "The verification failed."}
          {!error && "An unknown error occurred."}
        </p>
        <div className="pt-4">
          <Link href="/auth/sign-in">
            <Button>Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
