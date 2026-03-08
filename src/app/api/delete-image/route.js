import { deleteFromCloudinary } from '../../server/utils/cloudinaryService';

export async function DELETE(request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return Response.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    const result = await deleteFromCloudinary(publicId);
    
    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Image delete error:', error);
    return Response.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
