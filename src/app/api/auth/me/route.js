import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, clearAuthCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { name, email, bio, location, avatarUrl, socialLinks, role } = body;

    // Only allow upgrading to seller, not other arbitrary roles
    if (role && role !== 'seller') {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    // Check email uniqueness if email is changed
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== session.id) {
        return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(role === 'seller' && { role }),
      },
      select: {
        id: true, email: true, name: true, role: true,
        avatarUrl: true, bio: true, location: true,
        socialLinks: true, createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Auth me PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: session.id },
    });

    const response = NextResponse.json({ success: true, message: 'Account deleted' });
    clearAuthCookie(response);
    return response;
  } catch (error) {
    console.error('Auth me DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
