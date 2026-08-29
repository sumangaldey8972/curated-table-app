import { API_BASE_URL } from '../config/env';
import { tokenStorage } from '../utils/tokenStorage';

/**
 * Thin fetch wrapper for the curated-table-be API.
 *
 * The backend always responds with an envelope:
 *   { success: boolean, message: string, data?: any, error?: string }
 * On a non-2xx response (or `success: false`) this throws an `ApiError`
 * carrying the backend `message` so screens can surface it directly.
 */

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Attach the stored Bearer token (defaults to true). */
  auth?: boolean;
}

const REQUEST_TIMEOUT_MS = 15000;

export async function apiRequest<T = unknown>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.', 0);
    }
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      0
    );
  }
  clearTimeout(timeout);

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // fall through to status-based error below
  }

  if (!response.ok || !payload || payload.success === false) {
    const message =
      payload?.message || `Request failed (${response.status}). Please try again.`;
    throw new ApiError(message, response.status);
  }

  return payload.data as T;
}
