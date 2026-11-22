/**
 * Base URL for the Django API.
 *
 * - In the browser, requests go to the public API domain.
 * - On the server (RSC, route handlers, server actions), requests go to the
 *   internal Compose service so they do not depend on public DNS/TLS.
 *
 * INTERNAL_API_BASE_URL is only read at runtime on the server.
 */
const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/server'

export function apiBaseUrl(): string {
  if (typeof window === 'undefined' && process.env.INTERNAL_API_BASE_URL) {
    return process.env.INTERNAL_API_BASE_URL
  }
  return PUBLIC_API_BASE_URL
}
