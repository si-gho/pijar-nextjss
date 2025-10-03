import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        message: 'Database seeded successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        error: 'Failed to seed database',
        details: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}