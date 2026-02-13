import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'assets');
const uploadsDir = path.join(assetsDir, 'uploads');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and webp files
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only images, videos, and webp files are allowed.'));
    }
  }
});

const app = express();
const PORT = process.env.API_PORT || 6666;

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dentodent',
  user: process.env.DB_USER || 'dentodent',
  password: process.env.DB_PASSWORD || 'Deep@DOD',
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Also serve static files from the root public directory for backward compatibility
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({ 
      status: 'OK', 
      service: 'DOD - Content Management API with PostgreSQL',
      database: 'Connected'
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ 
      status: 'ERROR', 
      service: 'DOD - Content Management API with PostgreSQL',
      database: 'Disconnected',
      error: err.message
    });
  }
});

// Authentication endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // In production, validate against database
    // For demo purposes, we'll use the same credentials
    if (email === 'admin@dentodent.com' && password === 'Deep@DOD') {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      res.json({
        token,
        user: { id: 1, email: 'admin@dentodent.com', role: 'admin' }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload endpoint for media
app.post('/api/upload/media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate public URL for the uploaded file
    const fileUrl = `/assets/uploads/${req.file.filename}`;
    
    // Create media item record in database
    const result = await pool.query(
      `INSERT INTO media_items (title, caption, alt_text, url, category, file_path, file_type, file_size, original_name, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        req.body.title || req.file.originalname,
        req.body.caption || '',
        req.body.alt_text || '',
        fileUrl,
        req.body.category || 'general',
        fileUrl,
        req.file.mimetype,
        req.file.size,
        req.file.originalname
      ]
    );
    
    const newMediaItem = result.rows[0];
    
    console.log('Media file uploaded successfully', newMediaItem);
    res.status(201).json({
      message: 'File uploaded successfully',
      media: newMediaItem
    });
  } catch (err) {
    console.error('Media upload error:', err);
    res.status(500).json({ error: 'Failed to upload media file' });
  }
});

// Get all content - Updated to work with actual database schema
app.get('/api/content', async (req, res) => {
  try {
    console.log('Fetching all content from database');
    
    // Updated query to match actual database schema
    const result = await pool.query('SELECT id, section_name, title, subtitle, content, meta_title, meta_description, is_active, created_at, updated_at FROM content_sections WHERE is_active = true');
    const content = {};
    
    result.rows.forEach(row => {
      content[row.section_name] = {
        id: row.section_name,
        title: row.title,
        subtitle: row.subtitle,
        content: row.content,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    });
    
    console.log(`Returning ${Object.keys(content).length} content sections`);
    res.json(content);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// Get specific content section - Updated to work with actual database schema
app.get('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Fetching content section: ${section}`);
    
    // Updated query to match actual database schema
    const result = await pool.query(
      'SELECT id, section_name, title, subtitle, content, meta_title, meta_description, is_active, created_at, updated_at FROM content_sections WHERE section_name = $1 AND is_active = true',
      [section]
    );
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      const content = {
        id: row.section_name,
        title: row.title,
        subtitle: row.subtitle,
        content: row.content,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
      res.json(content);
    } else {
      res.status(404).json({ error: 'Content section not found' });
    }
  } catch (err) {
    console.error('Content section fetch error:', err);
    res.status(500).json({ error: 'Failed to load content section' });
  }
});

// Update content section - Updated to work with actual database schema
app.put('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const updatedData = req.body;
    
    console.log(`Updating content section: ${section}`, updatedData);
    
    // Updated query to match actual database schema
    const result = await pool.query(
      `UPDATE content_sections 
       SET title = $1, subtitle = $2, content = $3, meta_title = $4, meta_description = $5, is_active = $6, updated_at = NOW()
       WHERE section_name = $7
       RETURNING *`,
      [
        updatedData.title || '',
        updatedData.subtitle || '',
        updatedData.content || '',
        updatedData.meta_title || '',
        updatedData.meta_description || '',
        updatedData.is_active !== undefined ? updatedData.is_active : true,
        section
      ]
    );
    
    if (result.rowCount > 0) {
      const row = result.rows[0];
      console.log(`Content section ${section} updated successfully`);
      res.json({
        message: 'Content updated successfully',
        data: {
          id: row.section_name,
          title: row.title,
          subtitle: row.subtitle,
          content: row.content,
          meta_title: row.meta_title,
          meta_description: row.meta_description,
          is_active: row.is_active,
          created_at: row.created_at,
          updated_at: row.updated_at
        }
      });
    } else {
      res.status(404).json({ error: 'Content section not found' });
    }
  } catch (err) {
    console.error('Content update error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Create new content section - Updated to work with actual database schema
app.post('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const newData = req.body;
    
    console.log(`Creating new content section: ${section}`, newData);
    
    // Check if section already exists
    const existing = await pool.query(
      'SELECT 1 FROM content_sections WHERE section_name = $1',
      [section]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Content section already exists' });
    }
    
    // Updated query to match actual database schema
    const result = await pool.query(
      `INSERT INTO content_sections (section_name, title, subtitle, content, meta_title, meta_description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        section,
        newData.title || '',
        newData.subtitle || '',
        newData.content || '',
        newData.meta_title || '',
        newData.meta_description || '',
        newData.is_active !== undefined ? newData.is_active : true
      ]
    );
    
    const row = result.rows[0];
    console.log(`Content section ${section} created successfully`);
    res.status(201).json({
      message: 'Content created successfully',
      data: {
        id: row.section_name,
        title: row.title,
        subtitle: row.subtitle,
        content: row.content,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at
      }
    });
  } catch (err) {
    console.error('Content creation error:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Delete content section - Updated to work with actual database schema
app.delete('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    
    console.log(`Deleting content section: ${section}`);
    
    // Updated query to match actual database schema
    const result = await pool.query(
      'DELETE FROM content_sections WHERE section_name = $1 RETURNING *',
      [section]
    );
    
    if (result.rowCount > 0) {
      console.log(`Content section ${section} deleted successfully`);
      res.json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content section not found' });
    }
  } catch (err) {
    console.error('Content deletion error:', err);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Media management endpoints
// Get all media items
app.get('/api/media', async (req, res) => {
  try {
    console.log('Fetching all media items from database');
    
    const result = await pool.query('SELECT * FROM media_items ORDER BY uploaded_at DESC');
    
    console.log(`Returning ${result.rows.length} media items`);
    res.json(result.rows);
  } catch (err) {
    console.error('Media fetch error:', err);
    res.status(500).json({ error: 'Failed to load media items' });
  }
});

// Get specific media item
app.get('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mediaId = parseInt(id);
    
    if (isNaN(mediaId)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    
    console.log(`Fetching media item with ID: ${mediaId}`);
    
    const result = await pool.query(
      'SELECT * FROM media_items WHERE id = $1',
      [mediaId]
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Media item not found' });
    }
  } catch (err) {
    console.error('Media item fetch error:', err);
    res.status(500).json({ error: 'Failed to load media item' });
  }
});

// Upload new media item (without file - for direct URL uploads)
app.post('/api/media', async (req, res) => {
  try {
    const mediaData = req.body;
    
    console.log('Creating new media item', mediaData);
    
    const result = await pool.query(
      `INSERT INTO media_items (title, caption, alt_text, url, category, tags, file_path, file_type, file_size, original_name, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [
        mediaData.title || '',
        mediaData.caption || '',
        mediaData.alt_text || '',
        mediaData.url || '',
        mediaData.category || 'general',
        mediaData.tags ? JSON.stringify(mediaData.tags) : JSON.stringify([]),
        mediaData.file_path || null,
        mediaData.file_type || null,
        mediaData.file_size || null,
        mediaData.original_name || null
      ]
    );
    
    const newMediaItem = result.rows[0];
    
    console.log('Media item created successfully', newMediaItem);
    res.status(201).json({
      message: 'Media item created successfully',
      media: newMediaItem
    });
  } catch (err) {
    console.error('Media creation error:', err);
    res.status(500).json({ error: 'Failed to create media item' });
  }
});

// Update media item
app.put('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const mediaId = parseInt(id);
    
    if (isNaN(mediaId)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    
    console.log(`Updating media item with ID: ${mediaId}`, updatedData);
    
    const result = await pool.query(
      `UPDATE media_items 
       SET title = $1, caption = $2, alt_text = $3, url = $4, category = $5, tags = $6, file_path = $7, file_type = $8, file_size = $9, original_name = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        updatedData.title || '',
        updatedData.caption || '',
        updatedData.alt_text || '',
        updatedData.url || '',
        updatedData.category || 'general',
        updatedData.tags ? JSON.stringify(updatedData.tags) : JSON.stringify([]),
        updatedData.file_path || null,
        updatedData.file_type || null,
        updatedData.file_size || null,
        updatedData.original_name || null,
        mediaId
      ]
    );
    
    if (result.rowCount > 0) {
      console.log(`Media item ${mediaId} updated successfully`);
      res.json({
        message: 'Media item updated successfully',
        media: result.rows[0]
      });
    } else {
      res.status(404).json({ error: 'Media item not found' });
    }
  } catch (err) {
    console.error('Media update error:', err);
    res.status(500).json({ error: 'Failed to update media item' });
  }
});

// Delete media item
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mediaId = parseInt(id);
    
    if (isNaN(mediaId)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    
    console.log(`Deleting media item with ID: ${mediaId}`);
    
    // First, get the file path to delete the actual file
    const mediaResult = await pool.query(
      'SELECT file_path FROM media_items WHERE id = $1',
      [mediaId]
    );
    
    const result = await pool.query(
      'DELETE FROM media_items WHERE id = $1 RETURNING *',
      [mediaId]
    );
    
    if (result.rowCount > 0) {
      // Delete the actual file if it exists
      if (mediaResult.rows[0] && mediaResult.rows[0].file_path) {
        const filePath = path.join(__dirname, 'public', mediaResult.rows[0].file_path);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(`Warning: Could not delete file ${filePath}:`, err.message);
          } else {
            console.log(`Successfully deleted file: ${filePath}`);
          }
        });
      }
      
      const deletedItem = result.rows[0];
      console.log(`Media item ${mediaId} deleted successfully`);
      res.json({ 
        message: 'Media item deleted successfully', 
        media: deletedItem 
      });
    } else {
      res.status(404).json({ error: 'Media item not found' });
    }
  } catch (err) {
    console.error('Media deletion error:', err);
    res.status(500).json({ error: 'Failed to delete media item' });
  }
});

// Image management endpoints (for compatibility with existing code)
// Get images
app.get('/api/images', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('Fetching images', category ? `for category: ${category}` : '');
    
    let query = 'SELECT * FROM images';
    let params = [];
    
    if (category) {
      query += ' WHERE category = $1 ORDER BY uploaded_at DESC';
      params = [category];
    } else {
      query += ' ORDER BY uploaded_at DESC';
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      images: result.rows,
      pagination: {
        page: 1,
        limit: result.rows.length,
        total: result.rows.length
      }
    });
  } catch (err) {
    console.error('Images fetch error:', err);
    res.status(500).json({ error: 'Failed to load images' });
  }
});

// Upload image
app.post('/api/images', async (req, res) => {
  try {
    const { url, alt, category } = req.body;
    
    if (!url || !alt) {
      return res.status(400).json({ error: 'URL and alt text required' });
    }
    
    const result = await pool.query(
      `INSERT INTO images (url, alt, category, uploaded_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [url, alt, category || 'general']
    );
    
    const newImage = result.rows[0];
    
    console.log('Image uploaded successfully', newImage);
    res.status(201).json({
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const imageId = parseInt(id);
    
    if (isNaN(imageId)) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
    
    console.log(`Deleting image with ID: ${imageId}`);
    
    const result = await pool.query(
      'DELETE FROM images WHERE id = $1 RETURNING *',
      [imageId]
    );
    
    if (result.rowCount > 0) {
      const deletedImage = result.rows[0];
      console.log(`Image with ID ${imageId} deleted successfully`);
      res.json({ message: 'Image deleted successfully', image: deletedImage });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (err) {
    console.error('Image deletion error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Banner API endpoints - Updated to work with actual database schema
// Get all banners
app.get('/api/banners', async (req, res) => {
  try {
    console.log('Fetching banners from database...');
    const result = await pool.query(
      'SELECT id, title, subtitle, image_url, mobile_image_url, link_url, alt_text, position, display_order, is_active, start_date, end_date, created_at, updated_at FROM banners WHERE is_active = true ORDER BY display_order ASC'
    );
    console.log(`Found ${result.rows.length} banners`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Get banner by ID
app.get('/api/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    
    const result = await pool.query(
      'SELECT id, title, subtitle, image_url, mobile_image_url, link_url, alt_text, position, display_order, is_active, start_date, end_date, created_at, updated_at FROM banners WHERE id = $1 AND is_active = true',
      [bannerId]
    );
    
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Banner not found' });
    }
  } catch (err) {
    console.error('Error fetching banner:', err);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

// Create new banner
app.post('/api/banners', async (req, res) => {
  try {
    const { 
      title, 
      subtitle, 
      image_url, 
      mobile_image_url,
      link_url, 
      alt_text,
      target,
      position, 
      display_order,
      is_active, 
      start_date, 
      end_date 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO banners (
        title, subtitle, image_url, mobile_image_url, link_url, alt_text, position, display_order, is_active, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        title || '',
        subtitle || '',
        image_url || '',
        mobile_image_url || '',
        link_url || '',
        alt_text || '',
        position || 'homepage',
        display_order || 0,
        is_active !== undefined ? is_active : true,
        start_date || null,
        end_date || null
      ]
    );
    
    const newBanner = result.rows[0];
    
    console.log('Banner created successfully', newBanner);
    res.status(201).json({
      message: 'Banner created successfully',
      banner: newBanner
    });
  } catch (err) {
    console.error('Banner creation error:', err);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// Update banner
app.put('/api/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    
    const { 
      title, 
      subtitle, 
      image_url, 
      mobile_image_url,
      link_url, 
      alt_text,
      target,
      position, 
      display_order,
      is_active, 
      start_date, 
      end_date 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE banners SET 
        title = $1, subtitle = $2, image_url = $3, mobile_image_url = $4, link_url = $5, alt_text = $6,
        position = $7, display_order = $8, is_active = $9, start_date = $10, end_date = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        title || '',
        subtitle || '',
        image_url || '',
        mobile_image_url || '',
        link_url || '',
        alt_text || '',
        position || 'homepage',
        display_order || 0,
        is_active !== undefined ? is_active : true,
        start_date || null,
        end_date || null,
        bannerId
      ]
    );
    
    if (result.rowCount > 0) {
      const updatedBanner = result.rows[0];
      console.log(`Banner with ID ${bannerId} updated successfully`);
      res.json({
        message: 'Banner updated successfully',
        banner: updatedBanner
      });
    } else {
      res.status(404).json({ error: 'Banner not found' });
    }
  } catch (err) {
    console.error('Banner update error:', err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Delete banner
app.delete('/api/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bannerId = parseInt(id);
    
    if (isNaN(bannerId)) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    
    console.log(`Deleting banner with ID: ${bannerId}`);
    
    // Updated query to match actual database schema
    const result = await pool.query(
      'DELETE FROM banners WHERE id = $1 RETURNING *',
      [bannerId]
    );
    
    if (result.rowCount > 0) {
      const deletedBanner = result.rows[0];
      console.log(`Banner with ID ${bannerId} deleted successfully`);
      res.json({ message: 'Banner deleted successfully', banner: deletedBanner });
    } else {
      res.status(404).json({ error: 'Banner not found' });
    }
  } catch (err) {
    console.error('Banner deletion error:', err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create content_sections table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_sections (
        id SERIAL PRIMARY KEY,
        section_name VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255),
        subtitle TEXT,
        content TEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        alt TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create media_items table with additional columns for file metadata
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        caption TEXT,
        alt_text VARCHAR(255),
        url TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        tags JSONB DEFAULT '[]',
        file_path TEXT,
        file_type VARCHAR(100),
        file_size INTEGER,
        original_name VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create banners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        link_url VARCHAR(500),
        target VARCHAR(20) DEFAULT '_self',
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Add new columns if they don't exist
    try {
      await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS subtitle TEXT`);
      await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS mobile_image_url TEXT`);
      await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255)`);
      await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0`);
      await pool.query(`ALTER TABLE banners ALTER COLUMN position TYPE VARCHAR(100), ALTER COLUMN position SET DEFAULT 'homepage'`);
    } catch (err) {
      console.log('Note: Some columns may already exist or require manual migration');
    }
    
    console.log('✅ Database tables checked/created successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
  }
}

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🦷 DOD - Content Management API with PostgreSQL running on port ${PORT}`);
      console.log(`Available endpoints:`);
      console.log(`  POST /api/login`);
      console.log(`  GET  /api/content`);
      console.log(`  GET  /api/content/:section`);
      console.log(`  PUT  /api/content/:section`);
      console.log(`  POST /api/content/:section`);
      console.log(`  DELETE /api/content/:section`);
      console.log(`  GET  /api/media`);
      console.log(`  GET  /api/media/:id`);
      console.log(`  POST /api/media`);
      console.log(`  PUT  /api/media/:id`);
      console.log(`  DELETE /api/media/:id`);
      console.log(`  GET  /api/images`);
      console.log(`  POST /api/images`);
      console.log(`  DELETE /api/images/:id`);
      console.log(`  GET  /api/banners`);
      console.log(`  GET  /api/banners/:id`);
      console.log(`  POST /api/banners`);
      console.log(`  PUT  /api/banners/:id`);
      console.log(`  DELETE /api/banners/:id`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start the server
startServer();