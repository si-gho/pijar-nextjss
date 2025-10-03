import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventories, transactions, projects } from '@/lib/schema';
import { eq, sum, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Get inventories with calculated current stock
    let query = db
      .select({
        id: inventories.id,
        name: inventories.name,
        unit: inventories.unit,
        initialStock: inventories.initialStock,
        projectId: inventories.projectId,
        projectName: projects.name,
        projectLocation: projects.location,
        // Calculate current stock based on transactions
        stockIn: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'in' THEN ${transactions.quantity} ELSE 0 END), 0)`,
        stockOut: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'out' THEN ${transactions.quantity} ELSE 0 END), 0)`,
      })
      .from(inventories)
      .leftJoin(projects, eq(inventories.projectId, projects.id))
      .leftJoin(transactions, eq(inventories.id, transactions.inventoryId))
      .groupBy(inventories.id, projects.id);

    if (projectId) {
      query = query.where(eq(inventories.projectId, parseInt(projectId)));
    }

    const result = await query;

    // Calculate current stock for each inventory
    const stocksWithCurrent = result.map(stock => ({
      ...stock,
      currentStock: Number(stock.initialStock) + Number(stock.stockIn) - Number(stock.stockOut),
      totalCapacity: Number(stock.initialStock) + Number(stock.stockIn), // For percentage calculation
    }));

    return NextResponse.json(stocksWithCurrent);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}