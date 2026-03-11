# Brochure Management System

## Overview

The brochure management system allows admins to upload, manage, and organize PDF brochures, while providing users with an easy way to view and download them.

## Features

### Admin Features (Manage Brochure)

- **Upload Brochures**: Upload PDF files to Cloudinary
- **Edit Brochures**: Update brochure details, metadata, and files
- **Delete Brochures**: Remove brochures and clean up from Cloudinary
- **Categorize**: Organize brochures by category (general, properties, projects, services, investment, other)
- **Featured**: Mark brochures as featured for prominence
- **Status Management**: Set status to active, inactive, or archived
- **Tags**: Add searchable tags to brochures
- **Version Control**: Track brochure versions
- **Analytics**: View download counts for each brochure

### User Features (Download Brochure)

- **Browse Brochures**: View all active brochures
- **Filter by Category**: Filter brochures by category
- **Preview PDFs**: Open brochures in a new tab before downloading
- **Download Tracking**: Automatic download count tracking
- **Featured Highlighting**: Easily spot featured brochures

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── brochures/
│   │       ├── route.js           # GET (list), POST (create)
│   │       └── [id]/
│   │           ├── route.js       # GET, PUT (update), DELETE
│   │           └── download/
│   │               └── route.js   # POST (track downloads)
│   ├── server/
│   │   └── models/
│   │       └── Brochure.js        # MongoDB schema
│   ├── dashboard/
│   │   └── manage-brochure/
│   │       └── page.js             # Admin page
│   └── download-brochure/
│       └── page.js                 # Public download page
└── components/
    └── dashboard-components/
        └── BrochureManagement/
            ├── ManageBrochure.js   # Admin component
            ├── BrochureDisplay.js  # User display component
            └── index.js             # Exports
```

## API Endpoints

### GET /api/brochures

Fetch all brochures with filters

- **Query Parameters:**
  - `category` - Filter by category
  - `status` - Filter by status (default: 'active')
  - `featured` - Filter featured only (true/false)
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)

### POST /api/brochures

Create a new brochure (Admin only)

- **Body:**
  - `file` - Base64 encoded PDF
  - `fileName` - Original filename
  - `title` - Brochure title
  - `description` - Optional description
  - `category` - Brochure category
  - `tags` - Array of tags
  - `uploadedBy` - User ID
  - `featured` - Boolean (default: false)
  - `status` - Status (default: 'active')
  - `version` - Version string

### GET /api/brochures/[id]

Get a single brochure by ID

### PUT /api/brochures/[id]

Update a brochure (Admin only)

- **Body:** Same as POST, file update is optional

### DELETE /api/brochures/[id]

Delete a brochure (Admin only)

### POST /api/brochures/[id]/download

Track brochure download

- Increments the download count

## Brochure Model Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String (enum: ['general', 'properties', 'projects', 'services', 'investment', 'other']),
  pdfUrl: String (required),        // Cloudinary URL
  publicId: String (required),      // Cloudinary public ID
  fileName: String (required),
  fileSize: Number,                 // in bytes
  downloadCount: Number (default: 0),
  featured: Boolean (default: false),
  status: String (enum: ['active', 'inactive', 'archived'], default: 'active'),
  displayOrder: Number (default: 0),
  uploadedBy: ObjectId (ref: User),
  tags: [String],
  version: String (default: '1.0'),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### For Admins

1. Go to `/dashboard/manage-brochure`
2. Click "Upload Brochure"
3. Fill in the form with:
   - Title
   - Category
   - Description (optional)
   - Tags (comma-separated)
   - Version
   - Status
   - Featured flag
   - PDF file
4. Click "Upload Brochure"

### For Users

1. Go to `/download-brochure`
2. Browse available brochures
3. Filter by category if needed
4. Click "View" to open PDF in new tab
5. Click "Download" to download the PDF
6. Download count is automatically tracked

## Cloudinary Integration

The brochures are stored in Cloudinary under the `brochures` folder. When a brochure is deleted, it's automatically removed from Cloudinary using the `publicId`.

## Security Considerations

- Brochure uploads should be restricted to authenticated admin users
- Add role-based middleware to `/api/brochures` POST, PUT, DELETE endpoints
- Only users with admin role can manage brochures
- Public users can only download active brochures

## Future Enhancements

- Search functionality
- Advanced filtering (date range, file size)
- Batch upload
- Preview thumbnails
- Analytics dashboard
- Email notifications for new brochures
- Brochure translations
- Pin order for featured brochures
