import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET single project
export async function GET(request, { params }) {
  try {
    const [projects] = await pool.query(`
      SELECT p.*, GROUP_CONCAT(s.id) as skill_ids, GROUP_CONCAT(s.name) as skill_names
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [params.id]);

    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projects[0];
    const formattedProject = {
      ...project,
      skills: project.skill_ids
        ? project.skill_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: project.skill_names.split(',')[index]
          }))
        : []
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) project
export async function PUT(request, { params }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { title, description, imageUrl, githubUrl, liveUrl, skills } = await request.json();
    const id = params.id;

    // Update project
    await connection.query(
      'UPDATE projects SET title = ?, description = ?, image_url = ?, github_url = ?, live_url = ? WHERE id = ?',
      [title, description, imageUrl, githubUrl, liveUrl, id]
    );

    // Delete existing skills
    await connection.query('DELETE FROM project_skills WHERE project_id = ?', [id]);

    // Insert new skills
    if (skills && skills.length > 0) {
      const projectSkillsValues = skills.map(skillId => [id, skillId]);
      await connection.query(
        'INSERT INTO project_skills (project_id, skill_id) VALUES ?',
        [projectSkillsValues]
      );
    }

    await connection.commit();
    
    return NextResponse.json({
      id,
      title,
      description,
      imageUrl,
      githubUrl,
      liveUrl,
      skills: skills.map(id => ({ id, name: '' })) // Skills will be populated on next fetch
    });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const id = params.id;

    // Delete project skills first (due to foreign key constraint)
    await connection.query('DELETE FROM project_skills WHERE project_id = ?', [id]);
    
    // Delete project
    await connection.query('DELETE FROM projects WHERE id = ?', [id]);

    await connection.commit();
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
