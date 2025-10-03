import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inventories, projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const baseQuery = db
      .select({
        id: inventories.id,
        name: inventories.name,
        unit: inventories.unit,
        initialStock: inventories.initialStock,
        projectId: inventories.projectId,
        projectName: projects.name,
      })
      .from(inventories)
      .leftJoin(projects, eq(inventories.projectId, projects.id));

    const result = projectId 
      ? await baseQuery.where(eq(inventories.projectId, parseInt(projectId)))
      : await baseQuery;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching inventories:', error);
    return NextResponse.json({ error: 'Failed to fetch inventories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, name, unit, initialStock, description } = body;

    // Validate required fields
    if (!projectId || !name?.trim() || !unit?.trim()) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'projectId, name, and unit are required'
      }, { status: 400 });
    }

    // Validate projectId is a valid number
    const parsedProjectId = parseInt(projectId);
    if (isNaN(parsedProjectId)) {
      return NextResponse.json({ 
        error: 'Invalid project ID',
        details: 'Project ID must be a valid number'
      }, { status: 400 });
    }

    // Validate initialStock if provided
    if (initialStock && (isNaN(Number(initialStock)) || Number(initialStock) < 0)) {
      return NextResponse.json({ 
        error: 'Invalid initial stock',
        details: 'Initial stock must be a positive number'
      }, { status: 400 });
    }

    // Check for duplicate material name in the same project
    const existingMaterial = await db
      .select()
      .from(inventories)
      .where(and(
        eq(inventories.projectId, parsedProjectId),
        eq(inventories.name, name.trim())
      ));

    if (existingMaterial.length > 0) {
      return NextResponse.json({ 
        error: 'Material already exists',
        details: `Material "${name.trim()}" already exists in this project`
      }, { status: 409 });
    }

    const newInventory = await db.insert(inventories).values({
      projectId: parsedProjectId,
      name: name.trim(),
      unit: unit.trim(),
      initialStock: initialStock || '0',
    }).returning();

    return NextResponse.json(newInventory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating inventory:', error);
    
    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('foreign key')) {
      return NextResponse.json({ 
        error: 'Invalid project ID',
        details: 'The specified project does not exist'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create inventory',
      details: 'Internal server error occurred'
    }, { status: 500 });
  }
}