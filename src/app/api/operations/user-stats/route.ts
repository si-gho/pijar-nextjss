import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactions, projects } from '@/lib/schema';
import { eq, sql, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1'; // Default user

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get material IN count for current month
    const [materialInResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        eq(transactions.type, 'in'),
        sql`${transactions.createdAt} >= ${startOfMonth}`,
        sql`${transactions.createdAt} <= ${endOfMonth}`
      ));

    // Get material OUT count for current month
    const [materialOutResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        eq(transactions.type, 'out'),
        sql`${transactions.createdAt} >= ${startOfMonth}`,
        sql`${transactions.createdAt} <= ${endOfMonth}`
      ));

    // Get active projects count (projects with transactions by this user)
    const [activeProjectsResult] = await db
      .select({ count: sql<number>`count(distinct ${transactions.projectId})` })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    // Get total transactions by this user
    const [totalTransactionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    return NextResponse.json({
      userId,
      currentMonth: {
        materialIn: Number(materialInResult.count),
        materialOut: Number(materialOutResult.count),
        activeProjects: Number(activeProjectsResult.count),
      },
      overall: {
        totalTransactions: Number(totalTransactionsResult.count),
        accuracy: 98, // Static for now, could be calculated based on validation status
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 });
  }
}