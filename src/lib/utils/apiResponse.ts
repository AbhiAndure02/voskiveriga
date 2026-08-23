import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

/**
 * Standard Success API Response Formatter
 */
export function successResponse<T>(
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Standard Error API Response Formatter
 */
export function errorResponse(
  message: string = 'Internal Server Error',
  errorCode: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: errorCode,
      details,
    },
    { status: statusCode }
  );
}
