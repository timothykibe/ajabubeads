import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const apiResponse = {
  // Success response
  success<T>(data: T, message: string = 'Success', status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      } as ApiResponse<T>,
      { status }
    );
  },

  // Created response (201)
  created<T>(data: T, message: string = 'Created') {
    return this.success(data, message, 201);
  },

  // Error response
  error(error: string, status: number = 400) {
    return NextResponse.json(
      {
        success: false,
        error,
      } as ApiResponse,
      { status }
    );
  },

  // Unauthorized response (401)
  unauthorized(error: string = 'Unauthorized') {
    return this.error(error, 401);
  },

  // Forbidden response (403)
  forbidden(error: string = 'Forbidden') {
    return this.error(error, 403);
  },

  // Not found response (404)
  notFound(error: string = 'Not found') {
    return this.error(error, 404);
  },

  // Validation error response (422)
  validationError(error: string) {
    return this.error(error, 422);
  },

  // Server error response (500)
  serverError(error: string = 'Internal server error') {
    return this.error(error, 500);
  },
};

// Error handler for API routes
export const handleApiError = (error: any) => {
  console.error('API Error:', error);

  if (error.message.includes('not found')) {
    return apiResponse.notFound(error.message);
  }

  if (error.message.includes('Unauthorized')) {
    return apiResponse.unauthorized(error.message);
  }

  if (error.message.includes('validation') || error.message.includes('required')) {
    return apiResponse.validationError(error.message);
  }

  return apiResponse.serverError(error.message);
};
