import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["operator", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Update user role in database using direct SQL
    // Note: This is a simplified approach - in production you'd want proper authorization
    const sql = neon(process.env.DATABASE_URL!);
    const updatedUser = await sql`
      UPDATE "user" 
      SET role = ${role}, updated_at = NOW() 
      WHERE id = ${userId} 
      RETURNING *
    `;

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser[0] 
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}