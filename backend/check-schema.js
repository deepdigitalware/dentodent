
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: '127.0.0.1',
  port: 5433, // Tunnel port
  database: 'dentodent',
  user: 'dentodent',
  password: 'Deep@DOD',
});

async function checkSchema() {
  try {
    const client = await pool.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'content_sections';
    `);
    console.log('Columns in content_sections:', res.rows);
    client.release();
    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
