import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventories, transactions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
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

    // Get query parameter for force delete
    const url = new URL(request.url);
    const forceDelete = url.searchParams.get('force') === 'true';

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

    // Check if inventory is used in any transactions
    const relatedTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.inventoryId, inventoryId))
      .limit(1);

    if (relatedTransactions.length > 0 && !forceDelete) {
      return NextResponse.json({ 
        error: 'Cannot delete inventory',
        details: 'This material is used in existing transactions and cannot be deleted',
        hasTransactions: true
      }, { status: 409 });
    }

    // If force delete is requested, delete related transactions first
    if (forceDelete && relatedTransactions.length > 0) {
      await db.delete(transactions).where(eq(transactions.inventoryId, inventoryId));
    }

    // Delete the inventory
    await db.delete(inventories).where(eq(inventories.id, inventoryId));

    return NextResponse.json({ 
      message: 'Inventory deleted successfully',
      deletedId: inventoryId,
      deletedWithTransactions: forceDelete && relatedTransactions.length > 0
    });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return NextResponse.json({ 
      error: 'Failed to delete inventory',
      details: 'Internal server error occurred'
    }, { status: 500 });
  }
}