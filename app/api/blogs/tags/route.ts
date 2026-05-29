import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/blogs/tags
export async function GET(request: NextRequest) {
  try {
    const tags = await blogService.getAllTags();
    return apiResponse.success(tags, 'Tags retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}
