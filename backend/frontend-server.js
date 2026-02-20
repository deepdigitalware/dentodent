import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());

// Serve static files with proper MIME types
const staticPath = path.join(__dirname, '..', 'dist-frontend');
app.use(express.static(staticPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Frontend' });
});

// Serve frontend - only serve index.html for non-static file routes
app.get('*', (req, res) => {
  // Check if the request is for a static asset
  const ext = path.extname(req.path);
  if (ext === '.js' || ext === '.css' || ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg' || ext === '.ico' || ext === '.woff' || ext === '.woff2' || ext === '.ttf') {
    // If it's a static asset and we got here, it means the file wasn't found
    return res.status(404).send('Not found');
  }
  // For all other routes, serve the index.html (for SPA routing)
  res.sendFile(path.join(__dirname, '..', 'dist-frontend', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Frontend running on port ${PORT}`);
});
