import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}
