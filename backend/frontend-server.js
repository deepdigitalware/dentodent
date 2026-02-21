import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.FRONTEND_PORT || process.env.PORT || 4000);
const API_ORIGIN = process.env.API_URL || process.env.API_ORIGIN || 'http://localhost:4444';

// Middleware
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: `${API_ORIGIN}/api`,
  changeOrigin: true,
  secure: false,
  ws: true,
  logLevel: 'silent'
}));

// Detect built frontend directory and index.html path
const distCandidates = [
  path.join(__dirname, '..', 'dist-frontend'),
  path.join(__dirname, '..', 'frontend', 'dist')
];
const distPath = distCandidates.find(p => fs.existsSync(p)) || distCandidates[0];
const indexCandidates = [
  path.join(distPath, 'index.html'),
  path.join(distPath, 'frontend', 'src', 'index.html')
];
const indexPath = indexCandidates.find(p => fs.existsSync(p)) || path.join(distPath, 'index.html');

// Serve static files with proper MIME types
app.use(express.static(distPath, {
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
  res.sendFile(indexPath);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Frontend running on port ${PORT}`);
});
