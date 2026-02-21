import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config(); // Loads from current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Also try parent if running from backend dir
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); // Also try process.cwd() .env

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
const PORT = process.env.PORT || process.env.API_PORT || 4444;

// Database configuration
const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'dentodent',
  user: process.env.PGUSER || 'dentodent',
  password: process.env.PGPASSWORD || 'Deep@DOD',
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:4001', 
    'http://localhost:5173', 
    'http://localhost:4000',
    'http://localhost:6000',
    'http://localhost:6001',
    'https://dentodentdentalclinic.com',
    'https://admin.dentodentdentalclinic.com',
    'https://api.dentodentdentalclinic.com',
    'http://dentodentdentalclinic.com',
    'http://admin.dentodentdentalclinic.com',
    'http://api.dentodentdentalclinic.com'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Serve static files from the public directory
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Also serve static files from the root public directory for backward compatibility
app.use(express.static(path.join(__dirname, 'public')));
// Health check handler
const healthCheck = async (req, res) => {
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
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

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

// Upload image
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate public URL for the uploaded file
    const fileUrl = `/assets/uploads/${req.file.filename}`;
    
    // Create image record in database
    const result = await pool.query(
      `INSERT INTO images (path, name, section, uploaded_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, path as url, name, section, uploaded_at`,
      [
        fileUrl,
        req.body.alt || req.file.originalname,
        req.body.section || 'general'
      ]
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

// Get all content
app.get('/api/content', async (req, res) => {
  try {
    console.log('Fetching all content from database');
    
    const result = await pool.query('SELECT section_id, content_data FROM content_sections');
    const content = {};
    
    result.rows.forEach(row => {
      content[row.section_id] = {
        id: row.section_id,
        ...row.content_data
      };
    });
    
    console.log(`Returning ${Object.keys(content).length} content sections`);
    res.json(content);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// Get specific content section
app.get('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Fetching content section: ${section}`);
    
    const result = await pool.query(
      'SELECT content_data FROM content_sections WHERE section_id = $1',
      [section]
    );
    
    if (result.rows.length > 0) {
      const content = {
        id: section,
        ...result.rows[0].content_data
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

// Update content section
app.put('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const updatedData = req.body;
    
    console.log(`Updating content section: ${section}`, updatedData);
    
    // Remove the id from the data to store (it's in the section parameter)
    const { id, ...dataToStore } = updatedData;
    
    // Upsert the content section
    const result = await pool.query(
      `INSERT INTO content_sections (section_id, content_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (section_id)
       DO UPDATE SET content_data = $2, updated_at = NOW()
       RETURNING *`,
      [section, dataToStore]
    );
    
    console.log(`Content section ${section} updated successfully`);
    res.json({
      message: 'Content updated successfully',
      data: {
        id: section,
        ...result.rows[0].content_data
      }
    });
  } catch (err) {
    console.error('Content update error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Create new content section
app.post('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const newData = req.body;
    
    console.log(`Creating new content section: ${section}`, newData);
    
    // Check if section already exists
    const existing = await pool.query(
      'SELECT 1 FROM content_sections WHERE section_id = $1',
      [section]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Content section already exists' });
    }
    
    // Remove the id from the data to store
    const { id, ...dataToStore } = newData;
    
    const result = await pool.query(
      `INSERT INTO content_sections (section_id, content_data, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [section, dataToStore]
    );
    
    console.log(`Content section ${section} created successfully`);
    res.status(201).json({
      message: 'Content created successfully',
      data: {
        id: section,
        ...result.rows[0].content_data
      }
    });
  } catch (err) {
    console.error('Content creation error:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Delete content section
app.delete('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    
    console.log(`Deleting content section: ${section}`);
    
    const result = await pool.query(
      'DELETE FROM content_sections WHERE section_id = $1 RETURNING *',
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

// Upload new media item
app.post('/api/media', async (req, res) => {
  try {
    const mediaData = req.body;
    
    console.log('Uploading new media item', mediaData);
    
    const result = await pool.query(
      `INSERT INTO media_items (title, caption, alt_text, url, category, tags, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        mediaData.title || '',
        mediaData.caption || '',
        mediaData.alt_text || '',
        mediaData.url,
        mediaData.category || 'general',
        mediaData.tags ? JSON.stringify(mediaData.tags) : JSON.stringify([])
      ]
    );
    
    const newMediaItem = result.rows[0];
    
    console.log('Media item uploaded successfully', newMediaItem);
    res.status(201).json(newMediaItem);
  } catch (err) {
    console.error('Media upload error:', err);
    res.status(500).json({ error: 'Failed to upload media item' });
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
       SET title = $1, caption = $2, alt_text = $3, url = $4, category = $5, tags = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        updatedData.title || '',
        updatedData.caption || '',
        updatedData.alt_text || '',
        updatedData.url,
        updatedData.category || 'general',
        updatedData.tags ? JSON.stringify(updatedData.tags) : JSON.stringify([]),
        mediaId
      ]
    );
    
    if (result.rowCount > 0) {
      console.log(`Media item ${mediaId} updated successfully`);
      res.json(result.rows[0]);
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
    
    const result = await pool.query(
      'DELETE FROM media_items WHERE id = $1 RETURNING *',
      [mediaId]
    );
    
    if (result.rowCount > 0) {
      const deletedItem = result.rows[0];
      console.log(`Media item ${mediaId} deleted successfully`);
      res.json({ message: 'Media item deleted successfully', media: deletedItem });
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
    
    let query = 'SELECT id, path as url, name, section, uploaded_at FROM images';
    let params = [];
    
    if (category) {
      query += ' WHERE section = $1 ORDER BY uploaded_at DESC';
      params = [category];
    } else {
      query += ' ORDER BY uploaded_at DESC';
    }
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
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

// Banner API endpoints

// Metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    console.log('Fetching metrics from database');
    
    // Get content sections count
    const contentResult = await pool.query('SELECT COUNT(*) as count FROM content_sections');
    const contentCount = parseInt(contentResult.rows[0].count);
    
    // Get images count
    const imagesResult = await pool.query('SELECT COUNT(*) as count FROM images');
    const imagesCount = parseInt(imagesResult.rows[0].count);
    
    // Get media items count
    const mediaResult = await pool.query('SELECT COUNT(*) as count FROM media_items');
    const mediaCount = parseInt(mediaResult.rows[0].count);
    
    // Get banners count
    const bannersResult = await pool.query('SELECT COUNT(*) as count FROM banners');
    const bannersCount = parseInt(bannersResult.rows[0].count);
    
    // Sample metrics data
    const metrics = {
      totalVisitors: 1240,
      pageViews: 3420,
      contactForms: 24,
      appointments: 18,
      imagesCount: imagesCount,
      contentSections: contentCount,
      mediaItems: mediaCount,
      banners: bannersCount,
      formsSubmissions: 42,
      recentActivities: [
        { action: 'Updated', section: 'Hero Section', created_at: new Date().toISOString() },
        { action: 'Added', section: 'New Banner', created_at: new Date(Date.now() - 3600000).toISOString() },
        { action: 'Modified', section: 'Services Content', created_at: new Date(Date.now() - 7200000).toISOString() },
        { action: 'Uploaded', section: 'Gallery Images', created_at: new Date(Date.now() - 10800000).toISOString() }
      ]
    };
    
    console.log('Metrics fetched successfully');
    res.json(metrics);
  } catch (err) {
    console.error('Metrics fetch error:', err);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});

// Get all banners
app.get('/api/banners', async (req, res) => {
  try {
    console.log('Fetching banners from database...');
    const result = await pool.query(
      'SELECT * FROM banners ORDER BY display_order ASC'
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
      'SELECT * FROM banners WHERE id = $1',
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
      position, 
      display_order, 
      is_active, 
      start_date, 
      end_date 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO banners (
        title, subtitle, image_url, mobile_image_url, link_url, 
        alt_text, position, display_order, is_active, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        title || '',
        subtitle || '',
        image_url || '',
        mobile_image_url || null,
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
      position, 
      display_order, 
      is_active, 
      start_date, 
      end_date 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE banners SET 
        title = $1, subtitle = $2, image_url = $3, mobile_image_url = $4, link_url = $5,
        alt_text = $6, position = $7, display_order = $8, is_active = $9, start_date = $10, end_date = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        title || '',
        subtitle || '',
        image_url || '',
        mobile_image_url || null,
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
        section_id VARCHAR(100) PRIMARY KEY,
        content_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        url TEXT,
        alt TEXT,
        category VARCHAR(100) DEFAULT 'general',
        path TEXT,
        name TEXT,
        section VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create media_items table
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
        file_size BIGINT,
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
      )
    `);
    
    // Insert sample data if tables are empty
    const contentCount = await pool.query('SELECT COUNT(*) FROM content_sections');
    if (parseInt(contentCount.rows[0].count) === 0) {
      // Insert sample hero content
      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'hero',
        JSON.stringify({
          title: "Exceptional Dental Care",
          subtitle: "Your smile is our priority",
          content: "We provide comprehensive dental services with the latest technology and techniques.",
          buttonText: "Book Appointment",
          buttonLink: "/appointment",
          image: "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200"
        })
      ]);
      
      // Insert sample about content
      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'about',
        JSON.stringify({
          title: "About Our Clinic",
          content: "Dent 'O' Dent has been serving the community with exceptional dental care for over 15 years. Our team of experienced professionals is committed to providing personalized treatment in a comfortable environment.",
          image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800"
        })
      ]);
      
      // Insert sample services content
      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'services',
        JSON.stringify({
          title: "Our Services",
          services: [
            {
              id: 1,
              title: "Teeth Cleaning",
              description: "Professional cleaning to remove plaque and tartar.",
              image: "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=400"
            },
            {
              id: 2,
              title: "Dental Implants",
              description: "Replace missing teeth with natural-looking implants.",
              image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"
            }
          ]
        })
      ]);
      
      // Insert sample slider content
      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'slider',
        JSON.stringify({
          items: [
            {
              image: "https://api.dentodentdentalclinic.com/assets/images/banner/slide1.svg",
              title: "Modern Dentistry",
              subtitle: "Advanced technology for painless treatments",
              linkUrl: "",
              linkLabel: "",
              order: 1,
              active: true
            },
            {
              image: "https://api.dentodentdentalclinic.com/assets/images/banner/slide2.svg",
              title: "Expert Care",
              subtitle: "Experienced professionals for your smile",
              linkUrl: "",
              linkLabel: "",
              order: 2,
              active: true
            },
            {
              image: "https://api.dentodentdentalclinic.com/assets/images/banner/slide3.svg",
              title: "Comfort First",
              subtitle: "Relaxing environment for your comfort",
              linkUrl: "",
              linkLabel: "",
              order: 3,
              active: true
            }          ]
        })
      ]);    }
    
    // Insert sample images if table is empty
    const imageCount = await pool.query('SELECT COUNT(*) FROM images');
    if (parseInt(imageCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO images (url, alt, category) VALUES
        ('https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200', 'Dental care', 'hero'),
        ('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800', 'Dental clinic', 'about')
      `);
    }
    
    // Insert sample media items if table is empty
    const mediaCount = await pool.query('SELECT COUNT(*) FROM media_items');
    if (parseInt(mediaCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO media_items (title, caption, alt_text, url, category, tags) VALUES
        ('Dental Care', 'Professional dental care service', 'Dental care', 'https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200', 'hero', '["dental", "care"]'),
        ('Dental Clinic', 'Modern dental clinic interior', 'Dental clinic', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800', 'about', '["clinic", "interior"]')
      `);
    }
    
    // Insert sample banners if table is empty
    const bannerCount = await pool.query('SELECT COUNT(*) FROM banners');
    if (parseInt(bannerCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO banners (title, subtitle, image_url, link_url, alt_text, position, display_order, is_active) VALUES
        ('Modern Dentistry', 'Advanced technology for painless treatments', '/assets/images/banner/slide1.svg', '', 'Modern Dentistry Banner', 'homepage', 1, true),
        ('Expert Care', 'Experienced professionals for your smile', '/assets/images/banner/slide2.svg', '', 'Expert Care Banner', 'homepage', 2, true),
        ('Comfort First', 'Relaxing environment for your comfort', '/assets/images/banner/slide3.svg', '', 'Comfort First Banner', 'homepage', 3, true)
      `);
    }
    
    console.log('✅ Database initialized successfully');
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
