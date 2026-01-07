import { HttpStatus } from '@nestjs/common';

/**
 * Common success HTTP status codes used in APIs
 */
export const ApiStatus = {
  /**
   * 200 OK
   * Use for:
   * - GET requests
   * - UPDATE requests
   * - General success responses
   */
  OK: HttpStatus.OK,

  /**
   * 201 Created
   * Use for:
   * - Creating a new resource (POST)
   * - User registration
   */
  CREATED: HttpStatus.CREATED,

  /**
   * 204 No Content
   * Use for:
   * - DELETE requests
   * - Success response with no body
   */
  NO_CONTENT: HttpStatus.NO_CONTENT,

  /**
   * 202 Accepted
   * Use for:
   * - Background jobs
   * - Async processing
   */
  ACCEPTED: HttpStatus.ACCEPTED,

  /**
   * 206 Partial Content
   * Use for:
   * - Pagination
   * - Partial data responses
   */
  PARTIAL_CONTENT: HttpStatus.PARTIAL_CONTENT,
} as const;

export interface ApiResponseOptions<T> {
  data?: T;
  message?: string;
  statusCode: HttpStatus;
  success: boolean;
}

// FUNCTION FOR API SUCCESS RESPONSE
export function apiResponse<T>({
  data,
  message = 'Success',
  statusCode = ApiStatus.OK,
  success = true,
}: ApiResponseOptions<T>) {
  return {
    statusCode,
    success,
    message,
    data,
  };
}
