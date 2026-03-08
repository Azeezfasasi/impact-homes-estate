import { uploadToCloudinary } from '../../server/utils/cloudinaryService';

export async function POST(request) {
  try {
    const { fileData, folderName = 'estate' } = await request.json();

    if (!fileData) {
      return Response.json(
        { error: 'No file data provided' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(fileData, folderName);
    
    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
