import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const POST = async (request: NextRequest) => {
  const middleware = requireAuth();
  const result = await middleware(request);
  
  if (result) return result;
  
  try {
    const body = await request.json();
    
    // Handle vote logic here
    // In a real app, you'd save to a database
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}