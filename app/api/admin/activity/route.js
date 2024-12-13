import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT * FROM activity 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const { type, title, user_id } = await request.json();
    const [result] = await connection.query(
      'INSERT INTO activity (type, title, user_id) VALUES (?, ?, ?)',
      [type, title, user_id]
    );
    return NextResponse.json({ 
      id: result.insertId,
      type,
      title,
      user_id,
      created_at: new Date()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
