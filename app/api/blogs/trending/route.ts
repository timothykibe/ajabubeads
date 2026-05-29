import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/blogs/trending
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');

    const blogs = await blogService.getTrendingBlogs(limit);
    return apiResponse.success(blogs, 'Trending blogs retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}
