import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';

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

const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'dentodent',
  user: process.env.PGUSER || 'dentodent',
  password: process.env.PGPASSWORD || 'Deep@DOD',
});

const isProduction = process.env.NODE_ENV === 'production';

const resolveAssetUrl = (value) => {
  if (!value || typeof value !== 'string') return value;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (!value.startsWith('/assets/') && !value.startsWith('/images/')) return value;
  if (!isProduction) return value;
  const base = process.env.ASSETS_BASE_URL || process.env.PUBLIC_ASSETS_BASE || 'https://api.dentodentdentalclinic.com';
  return `${base}${value}`;
};

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

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'DOD - Content Management API with PostgreSQL',
    message: 'See /health or /api/health for detailed status'
  });
});

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
      const raw = row.content_data || {};
      const normalized = (raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object')
        ? raw.data
        : raw;
      content[row.section_id] = {
        id: row.section_id,
        ...normalized
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
      const raw = result.rows[0].content_data || {};
      const normalized = (raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object')
        ? raw.data
        : raw;
      const content = {
        id: section,
        ...normalized
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
    const updatedDataRaw = req.body || {};
    const updatedData = (updatedDataRaw && typeof updatedDataRaw === 'object' && updatedDataRaw.data && typeof updatedDataRaw.data === 'object')
      ? updatedDataRaw.data
      : updatedDataRaw;
    
    console.log(`Updating content section: ${section}`, updatedData);
    
    const { id, ...dataToStore } = updatedData || {};
    
    const result = await pool.query(
      `INSERT INTO content_sections (section_id, content_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (section_id)
       DO UPDATE SET content_data = $2, updated_at = NOW()
       RETURNING *`,
      [section, dataToStore]
    );
    
    console.log(`Content section ${section} updated successfully`);
    const raw = result.rows[0].content_data || {};
    const normalized = (raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object')
      ? raw.data
      : raw;
    res.json({
      message: 'Content updated successfully',
      data: {
        id: section,
        ...normalized
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
    const newDataRaw = req.body || {};
    const newData = (newDataRaw && typeof newDataRaw === 'object' && newDataRaw.data && typeof newDataRaw.data === 'object')
      ? newDataRaw.data
      : newDataRaw;
    
    console.log(`Creating new content section: ${section}`, newData);
    
    const existing = await pool.query(
      'SELECT 1 FROM content_sections WHERE section_id = $1',
      [section]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Content section already exists' });
    }
    
    const { id, ...dataToStore } = newData || {};
    
    const result = await pool.query(
      `INSERT INTO content_sections (section_id, content_data, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [section, dataToStore]
    );
    
    console.log(`Content section ${section} created successfully`);
    const raw = result.rows[0].content_data || {};
    const normalized = (raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object')
      ? raw.data
      : raw;
    res.status(201).json({
      message: 'Content created successfully',
      data: {
        id: section,
        ...normalized
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
    const rows = result.rows.map(item => ({
      ...item,
      url: resolveAssetUrl(item.url),
      file_path: resolveAssetUrl(item.file_path)
    }));
    console.log(`Returning ${rows.length} media items`);
    res.json(rows);
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
    
    const result = await pool.query('SELECT * FROM media_items WHERE id = $1', [mediaId]);
    
    if (result.rows.length > 0) {
      const item = result.rows[0];
      const normalized = {
        ...item,
        url: resolveAssetUrl(item.url),
        file_path: resolveAssetUrl(item.file_path)
      };
      res.json(normalized);
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
    const rows = result.rows.map(row => ({
      ...row,
      url: resolveAssetUrl(row.url)
    }));
    res.json(rows);
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

app.get('/api/metrics', async (req, res) => {
  try {
    console.log('Fetching metrics from database');

    const contentResult = await pool.query('SELECT COUNT(*) as count FROM content_sections');
    const contentCount = parseInt(contentResult.rows[0].count);

    const imagesResult = await pool.query('SELECT COUNT(*) as count FROM images');
    const imagesCount = parseInt(imagesResult.rows[0].count);

    const mediaResult = await pool.query('SELECT COUNT(*) as count FROM media_items');
    const mediaCount = parseInt(mediaResult.rows[0].count);

    const bannersResult = await pool.query('SELECT COUNT(*) as count FROM banners');
    const bannersCount = parseInt(bannersResult.rows[0].count);

    const contactResult = await pool.query(
      "SELECT COUNT(*) as count FROM form_submissions WHERE form_type = 'contact'"
    );
    const contactForms = parseInt(contactResult.rows[0].count);

    const appointmentResult = await pool.query(
      "SELECT COUNT(*) as count FROM form_submissions WHERE form_type = 'appointment'"
    );
    const appointments = parseInt(appointmentResult.rows[0].count);

    const submissionsResult = await pool.query(
      'SELECT COUNT(*) as count FROM form_submissions'
    );
    const formsSubmissions = parseInt(submissionsResult.rows[0].count);

    const recentResult = await pool.query(
      'SELECT form_type, submission, submitted_at FROM form_submissions ORDER BY submitted_at DESC LIMIT 10'
    );

    const recentActivities = recentResult.rows.map(row => ({
      type: row.form_type,
      time: row.submitted_at,
      summary:
        row.form_type === 'appointment'
          ? `${row.submission?.firstName || ''} ${row.submission?.lastName || ''} requested ${row.submission?.service || ''}`.trim()
          : `${row.submission?.name || ''} sent a message`.trim()
    }));

    const metrics = {
      totalVisitors: 0,
      pageViews: 0,
      contactForms,
      appointments,
      imagesCount,
      contentSections: contentCount,
      mediaItems: mediaCount,
      banners: bannersCount,
      formsSubmissions,
      recentActivities
    };

    console.log('Metrics fetched successfully');
    res.json(metrics);
  } catch (err) {
    console.error('Metrics fetch error:', err);
    res.status(500).json({ error: 'Failed to load metrics' });
  }
});

const emailRecipients = (() => {
  const raw = process.env.EMAIL_RECIPIENTS;
  if (raw && typeof raw === 'string') {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [
    'deepversestudio@gmail.com',
    'drsetketuchakraborty@gmail.com'
  ];
})();

const getTransporter = () => {
  if ((process.env.EMAIL_PROVIDER === 'gmail') || (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || process.env.SMTP_USER,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS
      }
    });
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

const sendSubmissionEmail = async (type, submission) => {
  const transporter = getTransporter();
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@dentodent.local';
  const subject = type === 'appointment' 
    ? `New Appointment Request — ${submission?.service || ''}`
    : `New Contact Message — ${submission?.name || ''}`;
  const lines = Object.entries(submission || {}).map(([k, v]) => `<li><strong>${k}</strong>: ${String(v ?? '')}</li>`).join('');
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>${subject}</h2>
      <p>You received a new ${type} form submission from the website.</p>
      <ul>${lines}</ul>
      <hr />
      <p>Sent automatically from Dent 'O' Dent website.</p>
    </div>
  `;
  const text = `${subject}\n\n` + Object.entries(submission || {}).map(([k,v]) => `${k}: ${String(v ?? '')}`).join('\n');
  
  if (!transporter) {
    console.warn('[Forms] SMTP not configured. Skipping email send. Configure SMTP_HOST, SMTP_USER, SMTP_PASS.');
    return { sent: false, reason: 'smtp_not_configured' };
  }
  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: emailRecipients.join(','),
      subject,
      text,
      html
    });
    return { sent: true, messageId: info.messageId };
  } catch (e) {
    console.error('[Forms] Email send failed:', e);
    return { sent: false, reason: 'send_failed', error: String(e?.message || e) };
  }
};

app.get('/api/forms/schema/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(
      'SELECT schema FROM form_schemas WHERE form_type = $1',
      [type]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    res.json(result.rows[0].schema);
  } catch (err) {
    console.error('Form schema fetch error:', err);
    res.status(500).json({ error: 'Failed to load form schema' });
  }
});

app.put('/api/forms/schema/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { schema } = req.body || {};

    if (!schema || typeof schema !== 'object') {
      return res.status(400).json({ error: 'Invalid schema' });
    }

    const result = await pool.query(
      `INSERT INTO form_schemas (form_type, schema, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (form_type)
       DO UPDATE SET schema = $2, updated_at = NOW()
       RETURNING schema`,
      [type, schema]
    );

    res.json({ success: true, schema: result.rows[0].schema });
  } catch (err) {
    console.error('Form schema update error:', err);
    res.status(500).json({ error: 'Failed to save form schema' });
  }
});

app.get('/api/forms/submissions/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(
      'SELECT id, form_type, submission, submitted_at FROM form_submissions WHERE form_type = $1 ORDER BY submitted_at DESC',
      [type]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Form submissions fetch error:', err);
    res.status(500).json({ error: 'Failed to load form submissions' });
  }
});

app.post('/api/forms/submit/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { submission } = req.body || {};

    if (!submission || typeof submission !== 'object') {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const result = await pool.query(
      `INSERT INTO form_submissions (form_type, submission, submitted_at)
       VALUES ($1, $2, NOW())
       RETURNING id, form_type, submission, submitted_at`,
      [type, submission]
    );

    const row = result.rows[0];

    const mailResult = await sendSubmissionEmail(type, submission);
    const status = mailResult.sent ? 201 : 202;

    res.status(status).json({
      success: true,
      submission: row,
      email: mailResult
    });
  } catch (err) {
    console.error('Form submission error:', err);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Banner API endpoints

// Get all banners
app.get('/api/banners', async (req, res) => {
  try {
    console.log('Fetching banners from database...');
    const result = await pool.query('SELECT * FROM banners ORDER BY display_order ASC');
    const rows = result.rows.map(row => ({
      ...row,
      image_url: resolveAssetUrl(row.image_url),
      mobile_image_url: resolveAssetUrl(row.mobile_image_url)
    }));
    console.log(`Found ${rows.length} banners`);
    res.json(rows);
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_schemas (
        id SERIAL PRIMARY KEY,
        form_type VARCHAR(100) NOT NULL UNIQUE,
        schema JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id SERIAL PRIMARY KEY,
        form_type VARCHAR(100) NOT NULL,
        submission JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT NOW()
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
            }
          ]
        })
      ]);

      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'blogPosts',
        JSON.stringify({
          posts: [
            {
              id: 1,
              slug: "welcome-to-dentodent",
              title: "Welcome to Dent 'O' Dent Dental Clinic",
              category: "clinic-news",
              date: new Date().toISOString().split('T')[0],
              excerpt: "Discover how our team keeps your smile healthy and bright.",
              cover: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
              author: "Dent 'O' Dent Team",
              featured: true,
              readTime: "4 min",
              tags: ["clinic", "welcome"]
            },
            {
              id: 2,
              slug: "painless-root-canal-kolkata-2026",
              title: "Painless Root Canal Treatment in Kolkata (2026 Guide)",
              category: "root-canal",
              date: new Date().toISOString().split('T')[0],
              excerpt: "Learn how modern rotary instruments and digital X-rays make root canal therapy comfortable and predictable.",
              cover: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200",
              author: "Dr. Setketu Chakraborty",
              featured: true,
              readTime: "6 min",
              tags: ["root canal", "painless", "RCT"]
            },
            {
              id: 3,
              slug: "dental-implant-cost-kolkata-2026",
              title: "Dental Implant Cost in Kolkata (2026 Updated Pricing)",
              category: "implants",
              date: new Date().toISOString().split('T')[0],
              excerpt: "Transparent breakdown of single-tooth implant costs, full-arch options, and EMI facilities at Dent 'O' Dent.",
              cover: "https://images.unsplash.com/photo-1582719478250-cc250a63c9a3?w=1200",
              author: "Dent 'O' Dent Team",
              featured: true,
              readTime: "7 min",
              tags: ["implants", "cost", "kolkata"]
            },
            {
              id: 4,
              slug: "braces-vs-aligners-kolkata-2026",
              title: "Braces vs Clear Aligners: Which is Better for You in 2026?",
              category: "orthodontics",
              date: new Date().toISOString().split('T')[0],
              excerpt: "Compare metal braces, ceramic braces, and clear aligners for teens and working professionals.",
              cover: "https://images.unsplash.com/photo-1606811841690-4e2579c22109?w=1200",
              author: "Orthodontic Team",
              featured: false,
              readTime: "8 min",
              tags: ["braces", "aligners", "smile"]
            },
            {
              id: 5,
              slug: "teeth-whitening-safety-2026",
              title: "Is Teeth Whitening Safe in 2026? Myths vs Facts",
              category: "whitening",
              date: new Date().toISOString().split('T')[0],
              excerpt: "Understand in-clinic whitening vs home kits and how to keep sensitivity minimal.",
              cover: "https://images.unsplash.com/photo-1580915411954-282cb1c9c450?w=1200",
              author: "Dent 'O' Dent Team",
              featured: false,
              readTime: "5 min",
              tags: ["whitening", "sensitivity", "cosmetic"]
            }
          ]
        })
      ]);

      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'reviews',
        JSON.stringify({
          title: "What Our Patients Say",
          subtitle: "Real stories from our happy patients",
          items: [
            {
              name: "Sarah M.",
              rating: 5,
              message: "The team is incredibly kind and professional. Best dental experience I've ever had.",
              date: new Date().toISOString().split('T')[0]
            },
            {
              name: "James K.",
              rating: 5,
              message: "Clean clinic, modern equipment, and a dentist who explains everything clearly.",
              date: new Date().toISOString().split('T')[0]
            }
          ]
        })
      ]);

      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'treatments',
        JSON.stringify({
          title: "Featured Treatments",
          subtitle: "Comprehensive care for every smile",
          items: [
            {
              title: "Teeth Whitening",
              slug: "teeth-whitening",
              imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
              description: "Safe, effective whitening treatments to brighten your smile."
            },
            {
              title: "Invisalign",
              slug: "invisalign-aligners",
              imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
              description: "Discreet clear aligners to straighten your teeth comfortably."
            },
            {
              title: "Single-Visit Root Canal",
              slug: "single-visit-root-canal",
              imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600",
              description: "Modern rotary root canal treatment completed in one to two visits."
            },
            {
              title: "Dental Implants",
              slug: "dental-implants-kolkata",
              imageUrl: "https://images.unsplash.com/photo-1582719478250-cc250a63c9a3?w=600",
              description: "Natural-looking implant solutions for single or multiple missing teeth."
            }
          ]
        })
      ]);

      await pool.query(`
        INSERT INTO content_sections (section_id, content_data)
        VALUES ($1, $2)
      `, [
        'faq',
        JSON.stringify({
          title: "Frequently Asked Questions",
          subtitle: "Answers to common dental questions in 2026",
          items: [
            {
              id: "rct-pain-2026",
              question: "Is root canal treatment still painful in 2026?",
              answer: "With modern anesthesia, rotary instruments, and digital X-rays, most patients report only mild discomfort. At Dent 'O' Dent we also offer anxiety control protocols for nervous patients."
            },
            {
              id: "implant-longevity-2026",
              question: "How long do dental implants last?",
              answer: "With proper brushing, flossing, and regular checkups, implants can last 15–20 years or more. 3D planning and guided surgery in 2026 further improve long-term success."
            },
            {
              id: "aligner-time-2026",
              question: "How long do clear aligners take to straighten teeth?",
              answer: "Mild crowding may finish in 6–9 months, while complex cases can take 18–24 months. We monitor progress with periodic reviews and digital simulations."
            },
            {
              id: "whitening-frequency-2026",
              question: "How often can I do teeth whitening safely?",
              answer: "Most patients can safely whiten every 12–18 months with in-clinic protocols and remineralizing pastes. We avoid over-whitening to protect enamel."
            },
            {
              id: "emergency-dental-2026",
              question: "What should I do in a dental emergency at night?",
              answer: "Rinse with clean water, avoid taking aspirin directly on the gums, and contact our emergency number or WhatsApp. We prioritize severe pain, swelling, or trauma cases."
            }
          ]
        })
      ]);
    }
    
    // Insert sample images if table is empty
    const imageCount = await pool.query('SELECT COUNT(*) FROM images');
    if (parseInt(imageCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO images (url, alt, category) VALUES
        ('https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200', 'Dental care', 'hero'),
        ('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800', 'Dental clinic', 'about'),
        ('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200', 'Dental surgery team', 'gallery'),
        ('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200', 'Smiling patient in chair', 'gallery'),
        ('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200', 'Modern dental equipment', 'gallery'),
        ('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', 'Dentist explaining treatment plan', 'gallery'),
        ('https://images.unsplash.com/photo-1606813902914-9a6f01f90b54?w=1200', 'Dental hygienist at work', 'gallery'),
        ('https://images.unsplash.com/photo-1580910365203-7986c7a37c1b?w=1200', 'Close-up of bright smile', 'gallery'),
        ('https://images.unsplash.com/photo-1609843470416-425a1e4b8caa?w=1200', 'Child at dental clinic', 'gallery'),
        ('https://images.unsplash.com/photo-1599059813304-11265ba4b7a5?w=1200', 'Dental X-ray review', 'gallery'),
        ('https://images.unsplash.com/photo-1582719478250-cc250a63c9a3?w=1200', 'Dentist with patient consultation', 'gallery'),
        ('https://images.unsplash.com/photo-1606811841690-4e2579c22109?w=1200', 'Dental assistant preparing room', 'gallery')
      `);
    }
    
    // Insert sample media items if table is empty
    const mediaCount = await pool.query('SELECT COUNT(*) FROM media_items');
    if (parseInt(mediaCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO media_items (title, caption, alt_text, url, category, tags) VALUES
        ('Dental Care', 'Professional dental care service', 'Dental care', 'https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200', 'hero', '["dental", "care"]'),
        ('Dental Clinic', 'Modern dental clinic interior', 'Dental clinic', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800', 'about', '["clinic", "interior"]'),
        ('Smile Makeover', 'Before and after smile transformation', 'Smile makeover', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200', 'gallery', '["smile", "makeover"]'),
        ('Painless Root Canal', 'Modern endodontic treatment setup', 'Root canal setup', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200', 'gallery', '["root canal", "equipment"]')
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
      console.log(`  GET  /api/forms/schema/:type`);
      console.log(`  PUT  /api/forms/schema/:type`);
      console.log(`  GET  /api/forms/submissions/:type`);
      console.log(`  POST /api/forms/submit/:type`);
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
