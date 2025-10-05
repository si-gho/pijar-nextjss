import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventories, transactions } from '@/lib/schema';
import { eq, count, sum, desc, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inventoryId = parseInt(id);
    
    if (isNaN(inventoryId)) {
      return NextResponse.json({ 
        error: 'Invalid inventory ID',
        details: 'Inventory ID must be a valid number'
      }, { status: 400 });
    }

    // Check if inventory exists
    const inventory = await db
      .select()
      .from(inventories)
      .where(eq(inventories.id, inventoryId));

    if (inventory.length === 0) {
      return NextResponse.json({ 
        error: 'Inventory not found',
        details: 'The specified inventory does not exist'
      }, { status: 404 });
    }

    // Get transaction statistics
    const transactionStats = await db
      .select({
        transactionCount: count(),
        totalIn: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'in' THEN CAST(${transactions.quantity} AS INTEGER) ELSE 0 END), 0)`,
        totalOut: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'out' THEN CAST(${transactions.quantity} AS INTEGER) ELSE 0 END), 0)`
      })
      .from(transactions)
      .where(eq(transactions.inventoryId, inventoryId));

    // Get last transaction
    const lastTransaction = await db
      .select({
        date: transactions.createdAt,
        type: transactions.type,
        quantity: transactions.quantity
      })
      .from(transactions)
      .where(eq(transactions.inventoryId, inventoryId))
      .orderBy(desc(transactions.createdAt))
      .limit(1);

    const stats = transactionStats[0];
    
    return NextResponse.json({
      transactionCount: Number(stats.transactionCount) || 0,
      totalIn: Number(stats.totalIn) || 0,
      totalOut: Number(stats.totalOut) || 0,
      lastTransaction: lastTransaction.length > 0 ? {
        date: lastTransaction[0].date,
        type: lastTransaction[0].type,
        quantity: Number(lastTransaction[0].quantity)
      } : null
    });
  } catch (error) {
    console.error('Error fetching inventory related data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch related data',
      details: 'Internal server error occurred'
    }, { status: 500 });
  }
}