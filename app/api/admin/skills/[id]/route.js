import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET single skill
export async function GET(request, { params }) {
  try {
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(request, { params }) {
  try {
    const { name, description } = await request.json();
    await pool.query(
      'UPDATE skills SET name = ?, description = ? WHERE id = ?',
      [name, description, params.id]
    );
    return NextResponse.json({ id: params.id, name, description });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(request, { params }) {
  try {
    await pool.query('DELETE FROM skills WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
