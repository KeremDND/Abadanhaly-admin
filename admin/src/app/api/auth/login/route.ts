import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPassword, createSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get admin user (assuming single admin for now)
    const admin = await prisma.admin.findFirst();
    let adminId: string;

    if (!admin) {
      // Create default admin if none exists
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123',
        12
      );
      
      const newAdmin = await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });

      const isValid = await bcrypt.compare(password, newAdmin.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
      adminId = newAdmin.id;
    } else {
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(password, admin.password);
      
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
      adminId = admin.id;
    }

    // Create session
    const sessionToken = await createSession(adminId);
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

