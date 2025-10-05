import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactions, inventories, projects, user } from '@/lib/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'in', 'out', or null for all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const baseQuery = db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        unit: transactions.unit,
        notes: transactions.notes,
        createdAt: transactions.createdAt,
        material: inventories.name,
        materialUnit: inventories.unit,
        project: projects.name,
        projectLocation: projects.location,
        userName: user.name,
      })
      .from(transactions)
      .leftJoin(inventories, eq(transactions.inventoryId, inventories.id))
      .leftJoin(projects, eq(transactions.projectId, projects.id))
      .leftJoin(user, eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);

    const result = type && (type === 'in' || type === 'out')
      ? await baseQuery.where(eq(transactions.type, type))
      : await baseQuery;

    // Return paginated response
    return NextResponse.json({
      items: result,
      pagination: {
        page,
        limit,
        hasMore: result.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Transaction POST request body:', body);
    
    const { projectId, inventoryId, userId, type, quantity, unit, notes } = body;

    // Validate required fields
    if (!projectId || !inventoryId || !userId || !type || !quantity || !unit) {
      console.log('Missing required fields:', { projectId, inventoryId, userId, type, quantity, unit });
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'projectId, inventoryId, userId, type, quantity, and unit are required',
        received: { projectId, inventoryId, userId, type, quantity, unit }
      }, { status: 400 });
    }

    // Validate type
    if (type !== 'in' && type !== 'out') {
      return NextResponse.json({ 
        error: 'Invalid transaction type',
        details: 'Type must be either "in" or "out"'
      }, { status: 400 });
    }

    // Validate quantity
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return NextResponse.json({ 
        error: 'Invalid quantity',
        details: 'Quantity must be a positive number'
      }, { status: 400 });
    }

    // Validate that inventory exists and belongs to the project
    const inventory = await db
      .select()
      .from(inventories)
      .where(and(
        eq(inventories.id, inventoryId),
        eq(inventories.projectId, projectId)
      ));

    if (inventory.length === 0) {
      console.log('Inventory not found:', { inventoryId, projectId });
      return NextResponse.json({ 
        error: 'Invalid inventory or project',
        details: 'The specified material does not exist in this project'
      }, { status: 404 });
    }

    // Validate that user exists
    const userExists = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (userExists.length === 0) {
      console.log('User not found:', userId);
      return NextResponse.json({ 
        error: 'Invalid user',
        details: 'The specified user does not exist'
      }, { status: 404 });
    }

    // Additional validation for 'out' transactions - check stock availability
    if (type === 'out') {
      // Get current stock for this inventory
      const stockQuery = await db
        .select({
          initialStock: inventories.initialStock,
          stockIn: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'in' THEN CAST(${transactions.quantity} AS INTEGER) ELSE 0 END), 0)`,
          stockOut: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'out' THEN CAST(${transactions.quantity} AS INTEGER) ELSE 0 END), 0)`
        })
        .from(inventories)
        .leftJoin(transactions, eq(inventories.id, transactions.inventoryId))
        .where(eq(inventories.id, inventoryId))
        .groupBy(inventories.id);

      if (stockQuery.length === 0) {
        return NextResponse.json({ 
          error: 'Inventory not found',
          details: 'Cannot calculate stock for the specified material'
        }, { status: 404 });
      }

      const stock = stockQuery[0];
      const currentStock = Number(stock.initialStock || 0) + Number(stock.stockIn) - Number(stock.stockOut);
      const requestedQuantity = Number(quantity);

      console.log('Stock validation:', { 
        currentStock, 
        requestedQuantity, 
        initialStock: stock.initialStock,
        stockIn: stock.stockIn,
        stockOut: stock.stockOut
      });

      if (currentStock <= 0) {
        return NextResponse.json({ 
          error: 'Insufficient stock',
          details: 'Material is out of stock',
          currentStock: 0
        }, { status: 400 });
      }

      if (requestedQuantity > currentStock) {
        return NextResponse.json({ 
          error: 'Insufficient stock',
          details: `Requested quantity (${requestedQuantity}) exceeds available stock (${currentStock})`,
          currentStock,
          requestedQuantity
        }, { status: 400 });
      }
    }

    const transactionData = {
      projectId: parseInt(projectId),
      inventoryId: parseInt(inventoryId),
      userId,
      type,
      quantity: quantity.toString(),
      unit: unit.trim(),
      notes: notes?.trim() || null,
    };

    console.log('Creating transaction with data:', transactionData);

    const newTransaction = await db.insert(transactions).values(transactionData).returning();

    console.log('Transaction created successfully:', newTransaction[0]);
    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    
    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('foreign key')) {
      return NextResponse.json({ 
        error: 'Invalid reference',
        details: 'One or more referenced entities do not exist'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create transaction',
      details: 'Internal server error occurred'
    }, { status: 500 });
  }
}