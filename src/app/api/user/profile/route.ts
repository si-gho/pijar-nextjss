import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return user profile data
    return NextResponse.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role || 'operator',
      image: session.user.image,
      // Additional computed fields
      initials: session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
      displayRole: session.user.role === 'admin' ? 'Administrator' : 'Operator Lapangan'
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}