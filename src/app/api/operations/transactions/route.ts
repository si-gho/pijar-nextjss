import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactions, inventories, projects, users } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'in', 'out', or null for all
    const limit = parseInt(searchParams.get('limit') || '50');

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
        userName: users.name,
      })
      .from(transactions)
      .leftJoin(inventories, eq(transactions.inventoryId, inventories.id))
      .leftJoin(projects, eq(transactions.projectId, projects.id))
      .leftJoin(users, eq(transactions.userId, users.id))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);

    const result = type && (type === 'in' || type === 'out')
      ? await baseQuery.where(eq(transactions.type, type))
      : await baseQuery;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, inventoryId, userId, type, quantity, unit, notes } = body;

    // Validate required fields
    if (!projectId || !inventoryId || !userId || !type || !quantity || !unit) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'projectId, inventoryId, userId, type, quantity, and unit are required'
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
      return NextResponse.json({ 
        error: 'Invalid inventory or project',
        details: 'The specified material does not exist in this project'
      }, { status: 404 });
    }

    const newTransaction = await db.insert(transactions).values({
      projectId: parseInt(projectId),
      inventoryId: parseInt(inventoryId),
      userId,
      type,
      quantity: quantity.toString(),
      unit: unit.trim(),
      notes: notes?.trim() || null,
    }).returning();

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