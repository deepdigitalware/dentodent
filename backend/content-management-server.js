import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6666;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage for content (in production, this would be a database)
let contentStorage = {
  hero: {
    id: "hero",
    title: "Exceptional Dental Care",
    subtitle: "Your smile is our priority",
    content: "We provide comprehensive dental services with the latest technology and techniques.",
    buttonText: "Book Appointment",
    buttonLink: "/appointment",
    image: "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200"
  },
  about: {
    id: "about",
    title: "About Our Clinic",
    content: "Dent 'O' Dent has been serving the community with exceptional dental care for over 15 years. Our team of experienced professionals is committed to providing personalized treatment in a comfortable environment.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800"
  },
  services: {
    id: "services",
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
  }
};

// Media storage (in production, this would be a database)
let mediaStorage = [
  {
    id: 1,
    title: "Dental Care",
    caption: "Professional dental care service",
    alt_text: "Dental care",
    url: "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200",
    category: "hero",
    tags: ["dental", "care"],
    uploaded_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Dental Clinic",
    caption: "Modern dental clinic interior",
    alt_text: "Dental clinic",
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
    category: "about",
    tags: ["clinic", "interior"],
    uploaded_at: new Date().toISOString()
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'DOD - Content Management API' });
});

// Authentication endpoint
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
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

// Get all content
app.get('/api/content', (req, res) => {
  try {
    console.log('Returning all content');
    res.json(contentStorage);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// Get specific content section
app.get('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Fetching content section: ${section}`);
    
    if (contentStorage[section]) {
      res.json(contentStorage[section]);
    } else {
      res.status(404).json({ error: 'Content section not found' });
    }
  } catch (err) {
    console.error('Content section fetch error:', err);
    res.status(500).json({ error: 'Failed to load content section' });
  }
});

// Update content section
app.put('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params;
    const updatedData = req.body;
    
    console.log(`Updating content section: ${section}`, updatedData);
    
    if (!contentStorage[section]) {
      contentStorage[section] = {};
    }
    
    // Merge the updated data with existing data
    contentStorage[section] = {
      ...contentStorage[section],
      ...updatedData,
      id: section, // Ensure the ID is preserved
      lastUpdated: new Date().toISOString()
    };
    
    console.log(`Content section ${section} updated successfully`);
    res.json({
      message: 'Content updated successfully',
      data: contentStorage[section]
    });
  } catch (err) {
    console.error('Content update error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Create new content section
app.post('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params;
    const newData = req.body;
    
    console.log(`Creating new content section: ${section}`, newData);
    
    if (contentStorage[section]) {
      return res.status(409).json({ error: 'Content section already exists' });
    }
    
    contentStorage[section] = {
      ...newData,
      id: section,
      createdAt: new Date().toISOString()
    };
    
    console.log(`Content section ${section} created successfully`);
    res.status(201).json({
      message: 'Content created successfully',
      data: contentStorage[section]
    });
  } catch (err) {
    console.error('Content creation error:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Delete content section
app.delete('/api/content/:section', (req, res) => {
  try {
    const { section } = req.params;
    
    console.log(`Deleting content section: ${section}`);
    
    if (!contentStorage[section]) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    
    delete contentStorage[section];
    
    console.log(`Content section ${section} deleted successfully`);
    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    console.error('Content deletion error:', err);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Media management endpoints
// Get all media items
app.get('/api/media', (req, res) => {
  try {
    console.log('Fetching all media items');
    res.json(mediaStorage);
  } catch (err) {
    console.error('Media fetch error:', err);
    res.status(500).json({ error: 'Failed to load media items' });
  }
});

// Get specific media item
app.get('/api/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    const mediaId = parseInt(id);
    
    console.log(`Fetching media item with ID: ${mediaId}`);
    
    const mediaItem = mediaStorage.find(item => item.id === mediaId);
    if (mediaItem) {
      res.json(mediaItem);
    } else {
      res.status(404).json({ error: 'Media item not found' });
    }
  } catch (err) {
    console.error('Media item fetch error:', err);
    res.status(500).json({ error: 'Failed to load media item' });
  }
});

// Upload new media item
app.post('/api/media', (req, res) => {
  try {
    const newMedia = req.body;
    
    // Generate new ID
    const newId = mediaStorage.length > 0 ? Math.max(...mediaStorage.map(item => item.id)) + 1 : 1;
    
    const mediaItem = {
      id: newId,
      ...newMedia,
      uploaded_at: new Date().toISOString()
    };
    
    mediaStorage.push(mediaItem);
    
    console.log('Media item uploaded successfully', mediaItem);
    res.status(201).json(mediaItem);
  } catch (err) {
    console.error('Media upload error:', err);
    res.status(500).json({ error: 'Failed to upload media item' });
  }
});

// Update media item
app.put('/api/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const mediaId = parseInt(id);
    
    console.log(`Updating media item with ID: ${mediaId}`, updatedData);
    
    const mediaIndex = mediaStorage.findIndex(item => item.id === mediaId);
    if (mediaIndex === -1) {
      return res.status(404).json({ error: 'Media item not found' });
    }
    
    mediaStorage[mediaIndex] = {
      ...mediaStorage[mediaIndex],
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    console.log(`Media item ${mediaId} updated successfully`);
    res.json(mediaStorage[mediaIndex]);
  } catch (err) {
    console.error('Media update error:', err);
    res.status(500).json({ error: 'Failed to update media item' });
  }
});

// Delete media item
app.delete('/api/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    const mediaId = parseInt(id);
    
    console.log(`Deleting media item with ID: ${mediaId}`);
    
    const mediaIndex = mediaStorage.findIndex(item => item.id === mediaId);
    if (mediaIndex === -1) {
      return res.status(404).json({ error: 'Media item not found' });
    }
    
    const deletedItem = mediaStorage.splice(mediaIndex, 1)[0];
    
    console.log(`Media item ${mediaId} deleted successfully`);
    res.json({ message: 'Media item deleted successfully', media: deletedItem });
  } catch (err) {
    console.error('Media deletion error:', err);
    res.status(500).json({ error: 'Failed to delete media item' });
  }
});

// Image management endpoints (for compatibility with existing code)
let imageStorage = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200",
    alt: "Dental care",
    category: "hero"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
    alt: "Dental clinic",
    category: "about"
  }
];

// Get images
app.get('/api/images', (req, res) => {
  try {
    const { category } = req.query;
    console.log('Fetching images', category ? `for category: ${category}` : '');
    
    let filteredImages = imageStorage;
    if (category) {
      filteredImages = imageStorage.filter(img => img.category === category);
    }
    
    res.json({
      images: filteredImages,
      pagination: {
        page: 1,
        limit: filteredImages.length,
        total: filteredImages.length
      }
    });
  } catch (err) {
    console.error('Images fetch error:', err);
    res.status(500).json({ error: 'Failed to load images' });
  }
});

// Upload image
app.post('/api/images', (req, res) => {
  try {
    const { url, alt, category } = req.body;
    
    if (!url || !alt) {
      return res.status(400).json({ error: 'URL and alt text required' });
    }
    
    const newImage = {
      id: imageStorage.length + 1,
      url,
      alt,
      category: category || 'general',
      uploadedAt: new Date().toISOString()
    };
    
    imageStorage.push(newImage);
    
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
app.delete('/api/images/:id', (req, res) => {
  try {
    const { id } = req.params;
    const imageId = parseInt(id);
    
    console.log(`Deleting image with ID: ${imageId}`);
    
    const imageIndex = imageStorage.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    imageStorage.splice(imageIndex, 1);
    
    console.log(`Image with ID ${imageId} deleted successfully`);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Image deletion error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦷 DOD - Content Management API running on port ${PORT}`);
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
});