import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, inventories, user, transactions } from '@/lib/schema';
import { sql, eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get basic counts
    const [projectsCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const [inventoriesCount] = await db.select({ count: sql<number>`count(*)` }).from(inventories);
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(user);
    const [transactionsCount] = await db.select({ count: sql<number>`count(*)` }).from(transactions);

    // Get transaction counts by type
    const [transactionsIn] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.type, 'in'));

    const [transactionsOut] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.type, 'out'));

    // Get recent transactions
    const recentTransactions = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        unit: transactions.unit,
        notes: transactions.notes,
        createdAt: transactions.createdAt,
        material: inventories.name,
        project: projects.name,
        user: user.name,
      })
      .from(transactions)
      .leftJoin(inventories, eq(transactions.inventoryId, inventories.id))
      .leftJoin(projects, eq(transactions.projectId, projects.id))
      .leftJoin(user, eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    // Get projects with inventory counts
    const projectsWithStats = await db
      .select({
        id: projects.id,
        name: projects.name,
        location: projects.location,
        startDate: projects.startDate,
        endDate: projects.endDate,
        inventoryCount: sql<number>`count(${inventories.id})`,
      })
      .from(projects)
      .leftJoin(inventories, eq(projects.id, inventories.projectId))
      .groupBy(projects.id)
      .orderBy(projects.name);

    // Get users with transaction counts
    const usersWithStats = await db
      .select({
        id: user.id,
        name: user.name,
        role: user.role,
        transactionCount: sql<number>`count(${transactions.id})`,
      })
      .from(user)
      .leftJoin(transactions, eq(user.id, transactions.userId))
      .groupBy(user.id)
      .orderBy(user.name);

    return NextResponse.json({
      summary: {
        projects: Number(projectsCount.count),
        inventories: Number(inventoriesCount.count),
        users: Number(usersCount.count),
        transactions: {
          total: Number(transactionsCount.count),
          in: Number(transactionsIn.count),
          out: Number(transactionsOut.count),
        },
      },
      details: {
        projects: projectsWithStats,
        users: usersWithStats,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch database statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}