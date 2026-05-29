import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/blogs/tag/[slug]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const skip = new URL(request.url).searchParams.get('skip') || '0';
    const take = new URL(request.url).searchParams.get('take') || '10';

    const result = await blogService.getBlogsByTag(slug, {
      skip: parseInt(skip),
      take: parseInt(take),
    });

    return apiResponse.success(result, 'Blogs by tag retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}
