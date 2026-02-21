import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.ADMIN_PORT || process.env.PORT || 4001);
const API_ORIGIN = process.env.API_URL || 'https://api.dentodentdentalclinic.com';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:4001',
    'http://localhost:6001',
    'https://admin.dentodentdentalclinic.com',
    'https://dentodentdentalclinic.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this to handle URL-encoded data

// Disable caching for admin panel to ensure fresh content
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// API Routes must be defined BEFORE static file serving
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Admin Panel' });
});

// API Routes for admin login
app.post('/api/login', (req, res) => {
  try {
    console.log('Login request body:', req.body); // Debug log
    // Handle both possible parameter names
    const email = req.body.email || req.body.username;
    const password = req.body.password;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // For demo purposes - in production, validate against database
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

// API Routes for content management - Direct to VPS API
app.get('/api/content', async (req, res) => {
  try {
    // Direct to VPS API
    const vpsApiUrl = `${API_ORIGIN}/api/content`;
    console.log('Fetching content from VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl);
    const content = await response.json();
    
    console.log('Content loaded from VPS API:', Object.keys(content));
    res.json(content);
  } catch (err) {
    console.error('Content fetch error:', err);
    // Fallback to mock data if VPS API fails
    const mockContent = {
      hero: {
        title: "Exceptional Dental Care",
        subtitle: "Your smile is our priority",
        content: "We provide comprehensive dental services with the latest technology and techniques."
      },
      about: {
        title: "About Us",
        content: "Dedicated to providing exceptional dental care since 2005."
      },
      services: {
        title: "Our Services",
        content: "From routine cleanings to complex procedures, we've got you covered."
      },
      blog: {
        title: "Latest News",
        content: "Stay updated with our latest dental news and tips."
      },
      contact: {
        title: "Contact Us",
        content: "Get in touch with our friendly team."
      },
      doctor: {
        title: "Meet Our Doctor",
        content: "Experience with our qualified professionals."
      },
      testimonials: {
        title: "Patient Testimonials",
        content: "Hear what our patients have to say."
      },
      gallery: {
        title: "Our Gallery",
        content: "See our clinic and work."
      },
      privacyPolicy: {
        title: "Privacy Policy",
        content: "Your privacy is important to us."
      },
      termsOfService: {
        title: "Terms of Service",
        content: "Terms and conditions for using our services."
      },
      faq: {
        title: "Frequently Asked Questions",
        content: "Common questions answered."
      },
      appointment: {
        title: "Book an Appointment",
        content: "Schedule your visit with us."
      },
      slider: {
        title: "Featured Treatments",
        content: "Our most popular services."
      },
      cta: {
        title: "Call to Action",
        content: "Ready to get started?"
      },
      patient: {
        title: "Patient Portal",
        content: "Access your personal dental records."
      },
      footer: {
        title: "Footer Information",
        content: "Clinic information and links."
      },
      map: {
        title: "Find Us",
        content: "Our location on the map."
      },
      blogPosts: [
        {
          id: 1,
          title: "5 Tips for Better Oral Health",
          excerpt: "Simple daily habits that can improve your dental health.",
          content: "Maintaining good oral health doesn't have to be complicated...",
          date: "2023-10-15",
          author: "Dr. Jane Smith",
          category: "oral-health",
          tags: ["tips", "oral health", "daily habits"],
          image: "https://images.unsplash.com/photo-1588776813677-77d8010419d0?w=800",
          slug: "5-tips-for-better-oral-health"
        },
        {
          id: 2,
          title: "Understanding Dental Implants",
          excerpt: "Everything you need to know about dental implants.",
          content: "Dental implants are a popular solution for replacing missing teeth...",
          date: "2023-09-22",
          author: "Dr. John Doe",
          category: "treatments",
          tags: ["implants", "surgery", "restoration"],
          image: "https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800",
          slug: "understanding-dental-implants"
        }
      ],
      treatments: [
        {
          id: 1,
          title: "Teeth Whitening",
          description: "Professional teeth whitening services to brighten your smile.",
          image: "https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800",
          price: "$199"
        },
        {
          id: 2,
          title: "Dental Implants",
          description: "Replace missing teeth with natural-looking implants.",
          image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
          price: "From $1,299"
        }
      ],
      reviews: [
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          comment: "The team at Dent 'O' Dent is amazing! Highly recommend.",
          date: "2023-10-01"
        },
        {
          id: 2,
          name: "Michael Brown",
          rating: 4,
          comment: "Great service and friendly staff. Will be coming back.",
          date: "2023-09-15"
        }
      ]
    };
    res.json(mockContent);
  }
});

// API route for updating content - Direct to VPS API
app.put('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;
    
    // Direct to VPS API
    const vpsApiUrl = `${API_ORIGIN}/api/content/${section}`;
    console.log(`Updating content via VPS API: ${vpsApiUrl}`, data);
    
    const response = await fetch(vpsApiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Content update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route for handling images - Use local content management DB server
app.get('/api/images', async (req, res) => {
  try {
    // For gallery images, use local content management DB server to avoid authentication issues
    const { category } = req.query;
    
    if (category === 'gallery') {
      // Use local content management DB server for gallery images
      const localApiUrl = `http://localhost:6666/api/images?category=gallery`;
      console.log('Fetching gallery images from local API:', localApiUrl);
      
      const response = await fetch(localApiUrl);
      const images = await response.json();
      
      res.json(images);
    } else {
      // For other categories, proxy to VPS API
      const vpsApiUrl = `${API_ORIGIN}/api/images`;
      console.log('Fetching images from VPS API:', vpsApiUrl);
      
      const response = await fetch(vpsApiUrl);
      const images = await response.json();
      
      res.json(images);
    }
  } catch (err) {
    console.error('Images fetch error:', err);
    res.status(500).json({ error: 'Failed to load media items' });
  }
});

// API routes for media management - Direct to VPS API
// Get all media items
app.get('/api/media', async (req, res) => {
  try {
    const vpsApiUrl = `${API_ORIGIN}/api/media`;
    console.log('Fetching media items from VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl);
    const media = await response.json();
    
    res.json(media);
  } catch (err) {
    console.error('Media fetch error:', err);
    res.status(500).json({ error: 'Failed to load media items' });
  }
});

// Get specific media item
app.get('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vpsApiUrl = `${API_ORIGIN}/api/media/${id}`;
    console.log('Fetching media item from VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl);
    const media = await response.json();
    
    res.json(media);
  } catch (err) {
    console.error('Media item fetch error:', err);
    res.status(500).json({ error: 'Failed to load media item' });
  }
});

// Create new media item
app.post('/api/media', async (req, res) => {
  try {
    const mediaData = req.body;
    const vpsApiUrl = `${API_ORIGIN}/api/media`;
    console.log('Creating media item via VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mediaData)
    });
    
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Media creation error:', err);
    res.status(500).json({ error: 'Failed to create media item' });
  }
});

// Update media item
app.put('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mediaData = req.body;
    const vpsApiUrl = `${API_ORIGIN}/api/media/${id}`;
    console.log('Updating media item via VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mediaData)
    });
    
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Media update error:', err);
    res.status(500).json({ error: 'Failed to update media item' });
  }
});

// Delete media item
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vpsApiUrl = `https://api.dentodentdentalclinic.com/api/media/${id}`;
    console.log('Deleting media item via VPS API:', vpsApiUrl);
    
    const response = await fetch(vpsApiUrl, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Media deletion error:', err);
    res.status(500).json({ error: 'Failed to delete media item' });
  }
});

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '..', 'admin', 'dist')));

// Serve admin panel for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dist', 'admin.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Admin Panel running on port ${PORT}`);
});
