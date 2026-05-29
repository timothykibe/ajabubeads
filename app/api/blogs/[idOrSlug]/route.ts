import { NextRequest } from 'next/server';
import { blogService } from '@/lib/services/blog.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/blogs/[idOrSlug]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await context.params;

    let blog;
    // Try to get by slug first (more common)
    try {
      blog = await blogService.getBlogBySlug(idOrSlug);
    } catch {
      // If slug doesn't work, try by ID
      blog = await blogService.getBlog(idOrSlug);
    }

    return apiResponse.success(blog, 'Blog retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/blogs/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await context.params;
    const body = await request.json();

    const blog = await blogService.updateBlog(idOrSlug, {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage,
      author: body.author,
      tags: body.tags,
      isPublished: body.isPublished,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
    });

    return apiResponse.success(blog, 'Blog updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await context.params;

    await blogService.deleteBlog(idOrSlug);

    return apiResponse.success(null, 'Blog deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
