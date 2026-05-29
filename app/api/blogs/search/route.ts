import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/blogs/search?q=query
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');

    if (!query) {
      return apiResponse.validationError('Search query is required');
    }

    const result = await blogService.searchBlogs(query, { skip, take });
    return apiResponse.success(result, 'Search results retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}
