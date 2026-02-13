import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6003; // Changed from 7001 to 6003

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Backend API Proxy' });
});

// API proxy to VPS - all requests to /api/* are forwarded to the VPS API
app.use('/api', async (req, res) => {
  try {
    const target = `https://api.dentodentdentalclinic.com/api${req.url}`;
    const headers = { ...req.headers };
    // Remove headers that should not be forwarded
    delete headers['host'];
    // Ensure JSON content type for non-GET methods if body exists
    if (req.method !== 'GET' && req.method !== 'HEAD' && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }

    const init = {
      method: req.method,
      headers,
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req.body ? JSON.stringify(req.body) : undefined;
    }

    const response = await fetch(target, init);
    // Mirror status
    res.status(response.status);
    // Mirror selected headers
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() === 'content-encoding') return; // avoid compressed double-send
      res.setHeader(name, value);
    });
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('API proxy error:', err);
    res.status(502).json({ error: 'API proxy failed', details: String(err && err.message || err) });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Backend API Proxy running on port ${PORT}`);
  console.log(`All requests are being forwarded to https://api.dentodentdentalclinic.com`);
});