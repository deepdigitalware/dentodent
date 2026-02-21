import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 4444;

// Ensure directories exist
const dataDir = path.join(__dirname, 'data');
const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'assets');
const uploadsDir = path.join(assetsDir, 'uploads');

[dataDir, publicDir, assetsDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/assets', express.static(assetsDir));
// Also serve from root of public for convenience
app.use(express.static(publicDir));

// Data persistence helpers
const contentFile = path.join(dataDir, 'content.json');
const imagesFile = path.join(dataDir, 'images.json');
const mediaFile = path.join(dataDir, 'media.json');
const formsFile = path.join(dataDir, 'forms.json');

const readJSON = (file, defaultData = {}) => {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
  return defaultData;
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
};

// Initial Data Loading
let contentStore = readJSON(contentFile, {
  header: {}, hero: {}, about: {}, services: {}, contact: {}, doctor: {}, 
  testimonials: {}, gallery: {}, blog: {}, faq: {}, appointment: {}, 
  slider: {}, cta: {}, patient: {}, footer: {}, privacyPolicy: {}, 
  termsOfService: {}, blogPosts: [], treatments: [], reviews: [], map: {}
});

let imagesStore = readJSON(imagesFile, []);
let mediaStore = readJSON(mediaFile, []);
let formsStore = readJSON(formsFile, {
  schemas: {
    contact: {
      enabled: true,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'service', label: 'Service Needed', type: 'text', required: false },
        { name: 'message', label: 'Message', type: 'textarea', required: false }
      ]
    },
    appointment: {
      enabled: true,
      fields: [
        { name: 'service', label: 'Service', type: 'text', required: true },
        { name: 'preferredDate', label: 'Preferred Date', type: 'date', required: true },
        { name: 'preferredTime', label: 'Preferred Time', type: 'text', required: true },
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'notes', label: 'Notes', type: 'textarea', required: false }
      ]
    }
  },
  submissions: []
});

// Routes

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Local Content API (FS)' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Local Content API (FS)' });
});
app.get(['/', '/api'], (req, res) => {
  const endpoints = [
    'GET /api/health',
    'GET /health',
    'GET /api/metrics',
    'GET /api/content',
    'GET /api/content/:section',
    'GET /api/content/:section/:id',
    'PUT /api/content/:section',
    'POST /api/content/:section',
    'GET /api/images',
    'POST /api/images',
    'DELETE /api/images/:id',
    'GET /api/media',
    'GET /api/media/:id',
    'POST /api/upload/media',
    'PUT /api/media/:id',
    'DELETE /api/media/:id',
    'GET /api/banners',
    'POST /api/banners',
    'PUT /api/banners/:id',
    'DELETE /api/banners/:id',
    'GET /api/forms/schema/:type',
    'PUT /api/forms/schema/:type',
    'GET /api/forms/submissions/:type',
    'POST /api/forms/submit/:type',
    'POST /api/login'
  ];
  res.json({ service: 'DOD - Local Content API (FS)', endpoints });
});
app.get('/api/metrics', (req, res) => {
  const contactForms = formsStore.submissions.filter(s => s.type === 'contact').length;
  const appointments = formsStore.submissions.filter(s => s.type === 'appointment').length;
  const imagesCount = imagesStore.length;
  const contentSections = Object.keys(contentStore || {}).length;
  const formsSubmissions = formsStore.submissions.length;
  const recentActivities = formsStore.submissions.slice(0, 10).map(s => ({
    type: s.type,
    time: s.submitted_at,
    summary: s.type === 'appointment' ? `${s.submission.firstName || ''} ${s.submission.lastName || ''} requested ${s.submission.service || ''}`.trim()
      : `${s.submission.name || ''} sent a message`.trim()
  }));
  res.json({
    totalVisitors: 0,
    pageViews: 0,
    contactForms,
    appointments,
    imagesCount,
    contentSections,
    formsSubmissions,
    recentActivities
  });
});

// --- Forms API (Schemas & Submissions) ---
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
  // Gmail (recommended: App Password with 2-Step Verification)
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
  // Generic SMTP
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

// Get form schema
app.get('/api/forms/schema/:type', (req, res) => {
  const { type } = req.params;
  const schema = formsStore.schemas[type];
  if (!schema) return res.status(404).json({ error: 'Schema not found' });
  res.json(schema);
});

// Update form schema
app.put('/api/forms/schema/:type', (req, res) => {
  const { type } = req.params;
  const { schema } = req.body || {};
  if (!schema || typeof schema !== 'object') return res.status(400).json({ error: 'Invalid schema' });
  formsStore.schemas[type] = schema;
  writeJSON(formsFile, formsStore);
  res.json({ success: true, schema });
});

// List submissions by type
app.get('/api/forms/submissions/:type', (req, res) => {
  const { type } = req.params;
  const rows = formsStore.submissions.filter(s => s.type === type);
  res.json(rows);
});

// Submit a form (contact or appointment)
app.post('/api/forms/submit/:type', async (req, res) => {
  const { type } = req.params;
  const { submission } = req.body || {};
  if (!submission || typeof submission !== 'object') {
    return res.status(400).json({ error: 'Invalid submission' });
  }
  const row = {
    id: Date.now(),
    type,
    submission,
    submitted_at: new Date().toISOString()
  };
  formsStore.submissions.unshift(row);
  writeJSON(formsFile, formsStore);
  
  // Attempt to send email to recipients
  const mailResult = await sendSubmissionEmail(type, submission);
  const status = mailResult.sent ? 201 : 202;
  res.status(status).json({ success: true, submission: row, email: mailResult });
});
// Login (Mock)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@dentodent.com' && password === 'Deep@DOD') {
    res.json({
      token: 'mock-jwt-token-local',
      user: { id: 1, email, role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- Content API ---

// Get all content
app.get('/api/content', (req, res) => {
  res.json(contentStore);
});

// Get specific section
app.get('/api/content/:section', (req, res) => {
  const { section } = req.params;
  res.json(contentStore[section] || {});
});

// Update specific section
app.post('/api/content/:section', (req, res) => {
  const { section } = req.params;
  const data = req.body;
  
  contentStore[section] = data;
  writeJSON(contentFile, contentStore);
  
  res.json({ success: true, data: contentStore[section] });
});
// Support PUT for admin panel compatibility
app.put('/api/content/:section', (req, res) => {
  const { section } = req.params;
  const { data } = req.body;
  const payload = data !== undefined ? data : req.body;
  contentStore[section] = payload;
  writeJSON(contentFile, contentStore);
  res.json({ success: true, data: contentStore[section] });
});

// Handle Arrays (like blogPosts, reviews)
app.get('/api/content/:section/:id', (req, res) => {
  const { section, id } = req.params;
  if (Array.isArray(contentStore[section])) {
    const item = contentStore[section].find(i => i.id == id);
    if (item) return res.json(item);
  }
  res.status(404).json({ error: 'Not found' });
});

// --- Images / Media API ---

// Get all images
app.get('/api/images', (req, res) => {
  // Return list of images with full URLs
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const imagesWithUrls = imagesStore.map(img => ({
    ...img,
    url: img.path.startsWith('http') ? img.path : `${baseUrl}${img.path}`
  }));
  res.json(imagesWithUrls);
});

// Upload image
app.post('/api/images', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const { section = 'general' } = req.body;
  const relativePath = `/assets/uploads/${req.file.filename}`;
  
  const newImage = {
    id: Date.now().toString(),
    name: req.file.originalname,
    path: relativePath,
    section,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  };

  imagesStore.unshift(newImage); // Add to beginning
  writeJSON(imagesFile, imagesStore);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    ...newImage,
    url: `${baseUrl}${relativePath}`
  });
});

// Delete image
app.delete('/api/images/:id', (req, res) => {
  const { id } = req.params;
  const index = imagesStore.findIndex(img => img.id == id);
  
  if (index !== -1) {
    const img = imagesStore[index];
    // Try to delete file
    try {
      const filePath = path.join(publicDir, img.path.replace(/^\//, '')); // Remove leading slash
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Error deleting file:', e);
    }
    
    imagesStore.splice(index, 1);
    writeJSON(imagesFile, imagesStore);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// --- Generic Media API ---
// List media items
app.get('/api/media', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const out = mediaStore.map(m => ({
    ...m,
    file_url: m.file_path?.startsWith('http') ? m.file_path : `${baseUrl}${m.file_path || ''}`
  }));
  res.json(out);
});

// Upload media (images/videos/documents)
app.post('/api/upload/media', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const { title, caption = '', alt_text = '', category = 'general' } = req.body;
  const relativePath = `/assets/uploads/${req.file.filename}`;
  const item = {
    id: Date.now(),
    title: title || req.file.originalname,
    caption,
    alt_text,
    category,
    file_path: relativePath,
    file_type: req.file.mimetype,
    file_size: req.file.size,
    original_name: req.file.originalname,
    uploaded_at: new Date().toISOString()
  };
  mediaStore.unshift(item);
  writeJSON(mediaFile, mediaStore);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ 
    message: 'File uploaded successfully',
    media: { ...item, file_url: `${baseUrl}${relativePath}` }
  });
});

// Get one media item
app.get('/api/media/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = mediaStore.find(m => m.id === id);
  if (!item) return res.status(404).json({ error: 'Media item not found' });
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({ ...item, file_url: item.file_path?.startsWith('http') ? item.file_path : `${baseUrl}${item.file_path}` });
});

// Update media item
app.put('/api/media/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = mediaStore.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Media item not found' });
  const updated = { ...mediaStore[idx], ...req.body };
  mediaStore[idx] = updated;
  writeJSON(mediaFile, mediaStore);
  res.json(updated);
});

// Delete media item
app.delete('/api/media/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = mediaStore.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Media item not found' });
  const item = mediaStore[idx];
  try {
    const filePath = path.join(publicDir, item.file_path?.replace(/^\//, '') || '');
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error('Error deleting file:', e);
  }
  mediaStore.splice(idx, 1);
  writeJSON(mediaFile, mediaStore);
  res.json({ success: true });
});

// --- Banners API (Specific to SliderBanner) ---
// Usually stored in content.slider, but sometimes separate.
// We'll map it to content.slider for consistency.

app.get('/api/banners', (req, res) => {
  const slides = Array.isArray(contentStore.slider?.slides) ? contentStore.slider.slides : [];
  const normalized = slides.map((s, i) => ({
    id: s.id || String(i + 1),
    title: s.title || s.name || '',
    subtitle: s.subtitle || '',
    image_url: s.image_url || s.imageUrl || s.image || s.url || '',
    mobile_image_url: s.mobile_image_url || s.mobileImageUrl || '',
    link_url: s.link_url || s.linkUrl || '',
    link_label: s.link_label || s.linkLabel || s.cta || '',
    alt_text: s.alt_text || s.alt || 'Banner',
    display_order: s.display_order ?? s.order ?? i,
    is_active: typeof s.is_active === 'boolean' ? s.is_active : true,
  }));
  res.json(normalized);
});

app.post('/api/banners', (req, res) => {
  // Add new banner
  const newBanner = { id: Date.now().toString(), ...req.body };
  if (!contentStore.slider) contentStore.slider = { slides: [] };
  if (!contentStore.slider.slides) contentStore.slider.slides = [];
  
  contentStore.slider.slides.push(newBanner);
  writeJSON(contentFile, contentStore);
  res.json(newBanner);
});

app.put('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  if (!contentStore.slider?.slides) return res.status(404).json({error: 'No banners'});
  
  const index = contentStore.slider.slides.findIndex(s => s.id == id);
  if (index !== -1) {
    contentStore.slider.slides[index] = { ...contentStore.slider.slides[index], ...req.body };
    writeJSON(contentFile, contentStore);
    res.json(contentStore.slider.slides[index]);
  } else {
    res.status(404).json({error: 'Banner not found'});
  }
});

app.delete('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  if (!contentStore.slider?.slides) return res.status(404).json({error: 'No banners'});
  
  const index = contentStore.slider.slides.findIndex(s => s.id == id);
  if (index !== -1) {
    contentStore.slider.slides.splice(index, 1);
    writeJSON(contentFile, contentStore);
    res.json({ success: true });
  } else {
    res.status(404).json({error: 'Banner not found'});
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Local Content API (FS) running on port ${PORT}`);
  console.log(`📂 Data directory: ${dataDir}`);
  console.log(`📂 Uploads directory: ${uploadsDir}`);
});
