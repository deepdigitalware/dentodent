
import pg from 'pg';
const { Pool } = pg;

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dentodent',
  user: process.env.DB_USER || 'dentodent',
  password: process.env.DB_PASSWORD || 'Deep@DOD',
});

const schema = `
-- Drop existing tables to ensure fresh schema
DROP TABLE IF EXISTS content_sections CASCADE;
DROP TABLE IF EXISTS media_items CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS banners CASCADE;

-- Content Sections
CREATE TABLE IF NOT EXISTS content_sections (
  section_id VARCHAR(255) PRIMARY KEY,
  content_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Items
CREATE TABLE IF NOT EXISTS media_items (
  id SERIAL PRIMARY KEY,
  title TEXT,
  caption TEXT,
  alt_text TEXT,
  url TEXT,
  category VARCHAR(100),
  file_path TEXT,
  file_type VARCHAR(100),
  file_size INTEGER,
  original_name TEXT,
  tags JSONB DEFAULT '[]',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  path TEXT,
  name TEXT,
  section VARCHAR(100),
  category VARCHAR(100),
  url TEXT,
  alt TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  alt_text VARCHAR(255),
  position VARCHAR(100) DEFAULT 'homepage',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function initDb() {
  try {
    console.log('Connecting to database via tunnel...');
    const client = await pool.connect();
    console.log('Connected! Creating schema...');
    
    await client.query(schema);
    
    console.log('Schema created successfully!');
    client.release();
    await pool.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDb();
