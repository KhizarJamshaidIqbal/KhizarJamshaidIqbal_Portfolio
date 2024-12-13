import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const { sessionId, pageUrl } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    // Update or insert visitor
    await connection.query(`
      INSERT INTO visitors (session_id, ip_address, user_agent, page_url)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP, page_url = ?
    `, [sessionId, ip, userAgent, pageUrl, pageUrl]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function GET() {
  const connection = await pool.getConnection();
  try {
    // Get count of visitors active in last 5 minutes
    const [result] = await connection.query(`
      SELECT COUNT(DISTINCT session_id) as active_visitors
      FROM visitors
      WHERE last_seen >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    `);

    return NextResponse.json({
      activeVisitors: result[0].active_visitors || 0
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
