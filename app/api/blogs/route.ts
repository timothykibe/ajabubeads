import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// GET /api/blogs
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');
    const featured = url.searchParams.get('featured') === 'true';

    let result;
    if (featured) {
      result = await blogService.getTrendingBlogs(take);
      return apiResponse.success(result, 'Featured blogs retrieved');
    }

    result = await blogService.getAllBlogs({ skip, take });
    return apiResponse.success(result, 'Blogs retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/blogs (admin create blog)
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();

    const blog = await blogService.createBlog({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      author: body.author,
      tags: body.tags,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
    });

    return apiResponse.created(blog, 'Blog created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
