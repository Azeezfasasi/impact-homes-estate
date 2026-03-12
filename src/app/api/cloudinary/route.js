import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // 60 second timeout
});

/**
 * Retry upload with exponential backoff
 */
async function uploadWithRetry(fileData, folderName, fileType = null, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Determine resource type based on file type
      let resourceType = 'auto';
      let format = undefined;
      
      if (fileType === 'image/svg+xml') {
        resourceType = 'image';
        format = 'svg';
      }
      
      const uploadOptions = {
        folder: folderName,
        resource_type: resourceType,
        timeout: 60000,
      };
      
      // Only add format-related options for non-SVG files
      if (resourceType === 'auto') {
        uploadOptions.quality = 'auto';
        uploadOptions.fetch_format = 'auto';
      }
      
      if (format) {
        uploadOptions.format = format;
      }
      
      const result = await cloudinary.uploader.upload(fileData, uploadOptions);
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Only retry on timeout or connection errors
      if (!error.message.includes('Timeout') && !error.message.includes('ECONNREFUSED') && attempt === maxRetries) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Upload image to Cloudinary
 */
export async function POST(req) {
  try {
    const { fileData, folderName = 'rayob/gallery' } = await req.json();

    if (!fileData) {
      return Response.json(
        { message: 'File data is required' },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return Response.json(
        { message: 'Cloudinary is not configured' },
        { status: 500 }
      );
    }

    // Extract file type from data URL
    let fileType = null;
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const matches = fileData.match(/^data:([^;]+)/);
      if (matches) {
        fileType = matches[1];
      }
    }

    const result = await uploadWithRetry(fileData, folderName, fileType);

    // For SVG files, ensure the URL is served as an image
    let imageUrl = result.secure_url;
    if (fileType === 'image/svg+xml') {
      // Transform raw SVG URL to image delivery URL with proper format
      imageUrl = imageUrl.replace('/raw/upload/', '/image/upload/');
    }

    return Response.json({
      success: true,
      url: imageUrl,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return Response.json(
      {
        message: 'Failed to upload image to Cloudinary',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Delete image from Cloudinary
 */
export async function DELETE(req) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return Response.json(
        { message: 'Public ID is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return Response.json({
      success: result.result === 'ok',
      message: result.result,
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return Response.json(
      {
        message: 'Failed to delete image from Cloudinary',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
