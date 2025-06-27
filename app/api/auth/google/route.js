// app/api/auth/google/route.js

import { NextResponse } from 'next/server'; // 1. Import NextResponse
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/dbConnect'; // Assuming you have dbConnect in /lib
import User from '@/models/User';
import { generateToken } from '@/lib/utils';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// 2. The function is now an exported async function named POST
export async function POST(request) {
  await dbConnect(); // Connect to the database

  try {
    // 3. Get the request body using await request.json()
    const { token } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const { email, sub: googleId } = ticket.getPayload();

    // Your domain and admin check logic (this part is fine)
    const permittedUsers = process.env.NEXT_PUBLIC_PERMITTED_ADMINS || '';
    const isAdmin = permittedUsers.includes(email);

    if (!isAdmin && (!email || !email.endsWith('@icodeschool.com'))) {
        // 4. Use NextResponse to send JSON responses
        return NextResponse.json(
            { message: 'Access Denied. Only users with an @icodeschool.com email are permitted.' },
            { status: 403 }
        );
    }
    
    // Your user lookup/creation logic (this part is also fine)
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = new User({
        googleId,
        email,
        role: isAdmin ? 'admin' : 'user' // Assign role based on admin check
      });
      await user.save();
    }

    const appToken = generateToken(user._id, user.role);

    // 4. Use NextResponse for the success response
    return NextResponse.json({
        message: 'Authentication successful!',
        token: appToken,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
    }, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    // 4. Use NextResponse for the error response
    return NextResponse.json(
        { message: 'Login failed: Invalid token or server error' },
        { status: 401 }
    );
  }
}