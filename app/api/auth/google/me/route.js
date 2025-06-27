// /app/api/auth/me/route.js

import { NextResponse } from 'next/server';
import {verifyToken} from '@/lib/utils';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();

  try {
    // 1. Get the token from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify the token using your server-side utility
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // 3. Find the user and return their data (excluding the password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 4. If everything is valid, return the user data
    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}