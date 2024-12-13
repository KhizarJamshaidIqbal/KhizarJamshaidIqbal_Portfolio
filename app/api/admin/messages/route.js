import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function POST(request) {
  try {
    console.log('Received POST request');
    const { name, email, message } = await request.json();
    console.log('Request data:', { name, email, message });

    if (!name || !email || !message) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });

    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established');

    const [result] = await connection.execute(
      'INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, message]
    );
    console.log('Query executed successfully, result:', result);

    await connection.end();
    console.log('Connection closed');

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: `Failed to send message: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Received GET request');
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connecting to database with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    console.log('Database connection established');

    const [rows] = await connection.execute(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    console.log('Query executed successfully, result:', rows);

    await connection.end();
    console.log('Connection closed');

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: `Failed to fetch messages: ${error.message}` },
      { status: 500 }
    );
  }
}
