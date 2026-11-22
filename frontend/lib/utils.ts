import { apiBaseUrl } from './api-base'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const baseUrl = apiBaseUrl();
  const host = baseUrl.replace(/\/api\/?$/, '');
  
  if (url.startsWith('/')) {
    return `${host}${url}`;
  }
  return `${host}/${url}`;
}
