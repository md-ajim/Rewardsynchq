import { apiBaseUrl } from '@/lib/api-base'
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getAbsoluteImageUrl = (
  url: string | null | undefined,
  defaultUrl = 'https://RewardSyncHQ.com/og-image.png'
): string => {
  if (!url) return defaultUrl;

  // If it's already an absolute URL, return it as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Get backend API base URL from env
  const apiBase = apiBaseUrl();
  // Strip trailing /api or /server to get the backend host root
  const backendHost = apiBase.replace(/\/api\/?$/, '').replace(/\/server\/?$/, '');

  // Prepend backend host to relative paths
  if (url.startsWith('/')) {
    return `${backendHost}${url}`;
  }
  return `${backendHost}/${url}`;
};