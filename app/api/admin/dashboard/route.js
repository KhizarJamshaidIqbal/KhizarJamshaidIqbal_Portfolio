import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Get skills count
    let skillsTotal = 0;
    try {
      const [skillsResult] = await connection.query(`
        SELECT COUNT(*) as total 
        FROM portfolio_admin.skills
      `);
      skillsTotal = parseInt(skillsResult[0].total) || 0;
    } catch (skillsError) {
      console.error('Error querying skills:', skillsError);
    }

    // Get projects count
    let projectsTotal = 0;
    try {
      const [projectsResult] = await connection.query(`
        SELECT COUNT(*) as total 
        FROM portfolio_admin.projects
      `);
      projectsTotal = parseInt(projectsResult[0].total) || 0;
    } catch (projectsError) {
      console.error('Error querying projects:', projectsError);
    }

    // Get live visitors (active in last 5 minutes)
    let liveVisitors = 0;
    let previousVisitors = 0;
    try {
      const [currentResult] = await connection.query(`
        SELECT COUNT(DISTINCT session_id) as count
        FROM visitors
        WHERE last_seen >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      `);
      
      const [previousResult] = await connection.query(`
        SELECT COUNT(DISTINCT session_id) as count
        FROM visitors
        WHERE last_seen >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
        AND last_seen < DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      `);

      liveVisitors = parseInt(currentResult[0].count) || 0;
      previousVisitors = parseInt(previousResult[0].count) || 0;
    } catch (visitorError) {
      console.error('Error querying visitors:', visitorError);
    }

    // Calculate visitor growth percentage
    const visitorGrowth = previousVisitors > 0 
      ? (((liveVisitors - previousVisitors) / previousVisitors) * 100).toFixed(0)
      : '0';

    return NextResponse.json({
      skills: {
        total: skillsTotal,
        new: 0,
        percentage: '0%'
      },
      projects: {
        total: projectsTotal,
        completed: 0,
        percentage: '0%'
      },
      visitors: {
        total: liveVisitors,
        previous: previousVisitors,
        percentage: visitorGrowth + '%'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
