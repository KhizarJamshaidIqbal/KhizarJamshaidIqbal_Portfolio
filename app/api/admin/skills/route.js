import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// First, add the icon column if it doesn't exist
async function ensureIconColumn() {
  const connection = await pool.getConnection();
  try {
    // Check if column exists
    const [columns] = await connection.query('SHOW COLUMNS FROM skills LIKE ?', ['icon']);
    if (columns.length === 0) {
      await connection.query('ALTER TABLE skills ADD COLUMN icon VARCHAR(50) DEFAULT ?', ['SiCode']);
    }
  } catch (error) {
    console.error('Error checking/adding icon column:', error);
  } finally {
    connection.release();
  }
}

// GET all skills
export async function GET() {
  const connection = await pool.getConnection();
  try {
    await ensureIconColumn(); // Ensure the column exists
    const [rows] = await connection.query('SELECT * FROM skills ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// POST new skill
export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    await ensureIconColumn(); // Ensure the column exists
    const { name, description, icon = 'SiCode' } = await request.json();
    const [result] = await connection.query(
      'INSERT INTO skills (name, description, icon) VALUES (?, ?, ?)',
      [name, description, icon]
    );
    return NextResponse.json({ id: result.insertId, name, description, icon });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// PUT existing skill
export async function PUT(request) {
  const connection = await pool.getConnection();
  try {
    await ensureIconColumn(); // Ensure the column exists
    const { id, name, description, icon = 'SiCode' } = await request.json();
    await connection.query(
      'UPDATE skills SET name = ?, description = ?, icon = ? WHERE id = ?',
      [name, description, icon, id]
    );
    return NextResponse.json({ id, name, description, icon });
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// DELETE existing skill
export async function DELETE(request) {
  const connection = await pool.getConnection();
  try {
    const { id } = await request.json();
    await connection.query('DELETE FROM skills WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
