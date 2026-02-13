# Dent O Dent Content Management API

This is a standalone content management API for the Dent O Dent dental clinic website. It provides endpoints for managing website content, images, and other resources.

## Features

- Authentication endpoints
- Content management (CRUD operations)
- Image management
- Health checks
- CORS support

## Endpoints

### Authentication
- `POST /api/login` - Authenticate admin user

### Content Management
- `GET /api/content` - Get all content sections
- `GET /api/content/:section` - Get specific content section
- `PUT /api/content/:section` - Update content section
- `POST /api/content/:section` - Create new content section
- `DELETE /api/content/:section` - Delete content section

### Image Management
- `GET /api/images` - Get images (optional `?category=` filter)
- `POST /api/images` - Upload new image
- `DELETE /api/images/:id` - Delete image

### Health Check
- `GET /health` - API health status

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the API server:
   ```
   npm run content-api
   ```
   or
   ```
   node content-management-server.js
   ```

3. The server will start on port 6666 by default

## Deployment

1. Configure your VPS connection in `.env` file:
   ```
   VPS_HOST=your-vps-host.com
   VPS_USER=your-username
   VPS_PORT=22
   VPS_PASSWORD=your-password
   # Or use SSH key instead of password
   # VPS_KEY_PATH=/path/to/your/private/key
   ```

2. Run the deployment script:
   ```
   python deploy_backend.py
   ```

## Testing

Run the test suite:
```
node ../test_content_api.js
```

## Default Admin Credentials

- Email: `admin@dentodent.com`
- Password: `Deep@DOD`

## Notes

- This implementation uses in-memory storage for demonstration purposes
- In production, you should replace the in-memory storage with a proper database
- The API includes CORS support for cross-origin requests
- All endpoints return appropriate HTTP status codes and error messages