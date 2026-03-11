# Brochure System Setup Guide

## What Was Created

### Backend

1. **Brochure Model** (`src/app/server/models/Brochure.js`)
   - MongoDB schema with all necessary fields
   - Includes tracking for downloads, featured status, categories, etc.

2. **API Routes** (`src/app/api/brochures/`)
   - `route.js` - List and create brochures
   - `[id]/route.js` - Get, update, and delete individual brochures
   - `[id]/download/route.js` - Track downloads

### Frontend

1. **Admin Component** (`ManageBrochure.js`)
   - Upload new brochures
   - Edit existing brochures
   - Delete brochures
   - View all admin-uploaded brochures
   - Manage categories, status, featured flag

2. **User Component** (`BrochureDisplay.js`)
   - Display all active brochures
   - Filter by category
   - View and download brochures
   - Track downloads automatically

### Pages Updated

- `/download-brochure` - Public download page
- `/dashboard/manage-brochure` - Admin management page

## Key Features

✅ PDF upload to Cloudinary
✅ Download count tracking
✅ Category organization
✅ Featured brochures
✅ Version control
✅ Tags for organization
✅ Status management (active/inactive/archived)
✅ Responsive design
✅ Search/filter by category

## Next Steps (Recommended)

1. **Add Authentication Middleware** to API routes
   - Only admins can POST/PUT/DELETE to `/api/brochures`
   - Public users can only GET active brochures

2. **Add Link in Navigation**
   - Update MainNav to link "DOWNLOAD BROCHURES" button to `/download-brochure`
   - Add "Manage Brochures" link in admin dashboard

3. **Add to Sidebar**
   - Add brochures management to admin dashboard navigation

4. **Test Upload**
   - Navigate to `/dashboard/manage-brochure`
   - Try uploading a test PDF
   - Verify it shows on `/download-brochure`

## Environment Variables Required

Ensure these Cloudinary variables are in your `.env.local`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## File Size Limit

By default, Cloudinary uploads are limited to 100MB. PDFs are usually much smaller, so this shouldn't be an issue.

## Troubleshooting

**Issue: "Only PDF files are allowed"**

- Ensure the file is actually a PDF and has .pdf extension

**Issue: "Failed to upload file"**

- Check Cloudinary environment variables are set
- Check file is not too large

**Issue: Download count not incrementing**

- Verify the `/api/brochures/[id]/download` endpoint is being called
- Check browser console for errors

**Issue: Brochures not showing**

- Ensure brochures have `status: 'active'`
- Check MongoDB connection is working
- Check API response in network tab

## Customization

### Change Categories

Edit the `categories` array in `ManageBrochure.js` and the `category` enum in `Brochure.js`

### Change Display Order

Modify the `sort()` in `/api/brochures/route.js` to change default ordering

### Add More Fields

Add fields to the Brochure schema and update both components accordingly

### Styling

Both components use Tailwind CSS and `impact-gold` color variable for consistency
