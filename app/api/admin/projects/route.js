import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all projects
export async function GET() {
  try {
    const [projects] = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.image_url as imageUrl,
        p.github_url as githubUrl,
        p.live_url as liveUrl,
        GROUP_CONCAT(s.id) as skill_ids,
        GROUP_CONCAT(s.name) as skill_names
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      GROUP BY p.id
    `);

    // Format the projects data
    const formattedProjects = projects.map(project => ({
      ...project,
      imageUrl: project.imageUrl || null,
      githubUrl: project.githubUrl || null,
      liveUrl: project.liveUrl || null,
      skills: project.skill_ids
        ? project.skill_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: project.skill_names.split(',')[index]
          }))
        : []
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new project
export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { title, description, imageUrl, githubUrl, liveUrl, skills } = await request.json();
    
    // Insert project
    const [projectResult] = await connection.query(
      'INSERT INTO projects (title, description, image_url, github_url, live_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, imageUrl || null, githubUrl || null, liveUrl || null]
    );

    const projectId = projectResult.insertId;

    // Insert project skills if any
    if (skills && skills.length > 0) {
      const skillValues = skills.map(skillId => [projectId, skillId]);
      await connection.query(
        'INSERT INTO project_skills (project_id, skill_id) VALUES ?',
        [skillValues]
      );
    }

    await connection.commit();

    // Fetch the newly created project with skills
    const [newProject] = await connection.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.image_url as imageUrl,
        p.github_url as githubUrl,
        p.live_url as liveUrl,
        GROUP_CONCAT(s.id) as skill_ids,
        GROUP_CONCAT(s.name) as skill_names
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [projectId]);

    const formattedProject = {
      ...newProject[0],
      skills: newProject[0].skill_ids
        ? newProject[0].skill_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: newProject[0].skill_names.split(',')[index]
          }))
        : []
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// PUT update project
export async function PUT(request) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, title, description, imageUrl, githubUrl, liveUrl, skills } = await request.json();
    
    // Update project
    await connection.query(
      'UPDATE projects SET title = ?, description = ?, image_url = ?, github_url = ?, live_url = ? WHERE id = ?',
      [title, description, imageUrl || null, githubUrl || null, liveUrl || null, id]
    );

    // Update skills
    await connection.query('DELETE FROM project_skills WHERE project_id = ?', [id]);
    if (skills && skills.length > 0) {
      const skillValues = skills.map(skillId => [id, skillId]);
      await connection.query(
        'INSERT INTO project_skills (project_id, skill_id) VALUES ?',
        [skillValues]
      );
    }

    await connection.commit();

    // Fetch the updated project with skills
    const [updatedProject] = await connection.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.image_url as imageUrl,
        p.github_url as githubUrl,
        p.live_url as liveUrl,
        GROUP_CONCAT(s.id) as skill_ids,
        GROUP_CONCAT(s.name) as skill_names
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    const formattedProject = {
      ...updatedProject[0],
      skills: updatedProject[0].skill_ids
        ? updatedProject[0].skill_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: updatedProject[0].skill_names.split(',')[index]
          }))
        : []
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

// DELETE project
export async function DELETE(request) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = await request.json();

    // Delete project skills first (foreign key constraint)
    await connection.query('DELETE FROM project_skills WHERE project_id = ?', [id]);
    
    // Delete project
    await connection.query('DELETE FROM projects WHERE id = ?', [id]);

    await connection.commit();
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
