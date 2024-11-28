// import { jwtVerify, SignJWT } from 'jose';
// import { cookies } from 'next/headers';
// import { NextRequest } from 'next/server';

// const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// export async function getUser() {
//   const token = cookies().get('token')?.value;

//   if (!token) return null;

//   try {
//     const verified = await jwtVerify(token, secret);
//     return verified.payload as any;
//   } catch (err) {
//     return null;
//   }
// }

// export async function getUserFromRequest(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;

//   if (!token) return null;

//   try {
//     const verified = await jwtVerify(token, secret);
//     return verified.payload as any;
//   } catch (err) {
//     return null;
//   }
// }

// export async function login(user: { id: string; email: string; name: string }) {
//   const token = await new SignJWT(user)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setExpirationTime('1d')
//     .sign(secret);

//   cookies().set('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 86400 // 1 day
//   });

//   return token;
// }

// export function requireAuth() {
//   return async function middleware(request: NextRequest) {
//     const user = await getUserFromRequest(request);

//     if (!user) {
//       return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//         status: 401,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return null;
//   };
// }
