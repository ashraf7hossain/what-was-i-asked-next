// import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // In a real app, you'd validate credentials here
  const user = {
    id: '1',
    email: body.email,
    name: body.name,
  };

  // await login(user);

  return NextResponse.json({ success: true });
}
