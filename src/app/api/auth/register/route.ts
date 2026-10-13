import { NextResponse } from 'next/server';
import { findUserByEmail, saveUserToSupabase } from '@/lib/userStore';
import { UserRole } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role, hotelName, hotelSlug, phone } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in Supabase database
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in instead.' },
        { status: 409 }
      );
    }

    // Save user in Supabase database
    const user = await saveUserToSupabase({
      email: cleanEmail,
      name: name.trim(),
      password,
      role: (role as UserRole) || 'guest',
      hotelName,
      hotelSlug,
      phone,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hotelName: user.hotelName,
        hotelSlug: user.hotelSlug,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
