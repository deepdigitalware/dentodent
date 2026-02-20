import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

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

// Routes

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Local Content API (FS)' });
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

// --- Banners API (Specific to SliderBanner) ---
// Usually stored in content.slider, but sometimes separate.
// We'll map it to content.slider for consistency.

app.get('/api/banners', (req, res) => {
  res.json(contentStore.slider?.slides || []);
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
