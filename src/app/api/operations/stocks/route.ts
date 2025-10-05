import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventories, transactions, projects } from '@/lib/schema';
import { eq, sum, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get inventories with calculated current stock
    const baseQuery = db
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
      .groupBy(inventories.id, projects.id)
      .limit(limit)
      .offset(offset);

    const result = projectId 
      ? await baseQuery.where(eq(inventories.projectId, parseInt(projectId)))
      : await baseQuery;

    // Calculate current stock for each inventory
    const stocksWithCurrent = result.map(stock => ({
      ...stock,
      currentStock: Number(stock.initialStock) + Number(stock.stockIn) - Number(stock.stockOut),
      totalCapacity: Number(stock.initialStock) + Number(stock.stockIn), // For percentage calculation
    }));

    // Return paginated response
    return NextResponse.json({
      items: stocksWithCurrent,
      pagination: {
        page,
        limit,
        hasMore: stocksWithCurrent.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}