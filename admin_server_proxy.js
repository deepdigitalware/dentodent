import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6001;

// Determine dist path: prefer admin/dist, fallback to root/dist-admin
const primaryDist = path.join(__dirname, 'dist');
const fallbackDist = path.join(__dirname, '..', 'dist-admin');
const distPath = fs.existsSync(primaryDist) ? primaryDist : fallbackDist;
const assetsPath = path.join(distPath, 'assets');

console.log('Starting admin server...');
console.log('Serving directory:', distPath);

// Middleware
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ status: 'OK', service: 'DOD - Admin Panel' });
});

// API proxy to backend
app.use('/api', (req, res) => {
  const backendUrl = 'http://localhost:6666';
  const target = `${backendUrl}/api${req.url}`;

  console.log(`Proxying ${req.method} ${req.url} to ${target}`);

  // Parse the target URL
  const url = new URL(target);

  // Prepare request options
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: req.method,
    headers: { ...req.headers }
  };

  // Remove host header to avoid conflicts
  delete options.headers['host'];

  // Set content type for non-GET requests if body exists
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && !options.headers['content-type']) {
    options.headers['Content-Type'] = 'application/json';
  }

  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    // Forward status code
    res.status(proxyRes.statusCode);

    // Forward headers
    Object.keys(proxyRes.headers).forEach((key) => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    // Pipe the response
    proxyRes.pipe(res);
  });

  // Handle proxy request errors
  proxyReq.on('error', (error) => {
    console.error('Proxy request error:', error);
    res.status(502).json({
      error: 'API proxy failed',
      message: error.message
    });
  });

  // Pipe the request body if present
  req.pipe(proxyReq, { end: true });
});

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

// Serve built assets from dist assets directory
app.use('/assets', express.static(assetsPath));

// Serve admin panel - serve admin.html from detected dist path
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'admin.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Admin Panel running on port ${PORT}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
});
