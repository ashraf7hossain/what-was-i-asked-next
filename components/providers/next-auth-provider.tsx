'use client';

import { type ReactNode } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface Props {
  children: ReactNode;
}

export function NextAuthProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}