import { apiBaseUrl } from './api-base'
// lib/api.ts
import { BrandData, Deal, PopularBrand, AppReward, Product, DigitalAsset, Category } from '@/lib/types';

export interface AffiliateNetwork {
    id: number;
    name: string;
    domains: string;
    primary_subid_param: string;
    secondary_subid_param: string | null;
}

const API_BASE_URL = apiBaseUrl();

/**
 * Helper to ensure we always return an array from a potentially paginated response
 */
function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) {
    const arr = [...data];
    (arr as any).count = data.length;
    return arr;
  }
  if (data && Array.isArray(data.results)) {
    const arr = [...data.results];
    (arr as any).count = data.count;
    (arr as any).next = data.next;
    (arr as any).previous = data.previous;
    return arr;
  }
  return [];
}

async function fetchWithAuth(url: string, token?: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
       // Handle unauthorized (maybe redirect to login or refresh token)
    }
    return null;
  }
  return response.json();
}

export async function getBrands(params?: URLSearchParams): Promise<{ data: BrandData[], meta: any }> {
  try {
    const queryString = params ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/brands/${queryString}`, {
      cache: 'no-store'
    });
    if (!res.ok) return { data: [], meta: {} };
    const data = await res.json();
    
    // Handle DRF pagination
    if (data && data.results) {
        return {
            data: data.results,
            meta: {
                total: data.count,
                next: data.next,
                previous: data.previous
            }
        };
    }
    return { data: Array.isArray(data) ? data : [], meta: {} };
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return { data: [], meta: {} };
  }
}

export async function getBrandData(slug: string): Promise<BrandData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/brands/${slug}/`, {
      cache: 'no-store', next: { tags: ['brands'] } // Revalidate every hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch brand data:', error);
    return null;
  }
}

export async function getExtensionStores(): Promise<{ domain: string, rate: string, slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/extension/stores/`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch extension stores:', error);
    return [];
  }
}

export async function getAffiliateNetworks(): Promise<AffiliateNetwork[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/affiliate-networks/`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return ensureArray<AffiliateNetwork>(data);
  } catch (error) {
    console.error('Failed to fetch affiliate networks:', error);
    return [];
  }
}

export interface DealFilterParams {
    search?: string;
    category?: number | string;
    country?: string;
    brand?: string;
    min_cashback?: number;
    min_discount?: number;
    has_coupon?: boolean;
    has_discount?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export async function getDeals(): Promise<Deal[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/deals/?ordering=-created_at`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<Deal>(data);
    } catch (error) {
        console.error('Failed to fetch deals:', error);
        return [];
    }
}

export async function fetchDeals(params: DealFilterParams = {}): Promise<{ results: Deal[]; count: number }> {
    try {
        const query = new URLSearchParams();
        if (params.search)       query.set('search', params.search);
        if (params.category)     query.set('category', String(params.category));
        if (params.country && params.country !== 'Global') query.set('country', params.country);
        if (params.brand && params.brand !== 'all') query.set('brand', params.brand);
        if (params.min_cashback && params.min_cashback > 0) query.set('min_cashback', String(params.min_cashback));
        if (params.min_discount && params.min_discount > 0) query.set('min_discount', String(params.min_discount));
        if (params.has_coupon)   query.set('has_coupon', 'true');
        if (params.has_discount) query.set('has_discount', 'true');
        if (params.ordering)     query.set('ordering', params.ordering);
        if (params.page)         query.set('page', String(params.page));
        if (params.page_size)    query.set('page_size', String(params.page_size));

        const res = await fetch(`${API_BASE_URL}/deals/?${query.toString()}`, {
            cache: 'no-store',
        });
        if (!res.ok) return { results: [], count: 0 };
        const data = await res.json();
        if (Array.isArray(data)) return { results: data, count: data.length };
        return { results: data.results ?? [], count: data.count ?? 0 };
    } catch (error) {
        console.error('Failed to fetch deals:', error);
        return { results: [], count: 0 };
    }
}


export async function getDealDetail(id: string): Promise<Deal | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/deals/${id}/`, {
            cache: 'no-store', next: { tags: ['deals'] }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch deal detail:', error);
        return null;
    }
}

export async function getPopularBrands(): Promise<PopularBrand[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/popular-brands/`, {
            cache: 'no-store' // Revalidate once a day
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<PopularBrand>(data);
    } catch (error) {
        console.error('Failed to fetch popular brands:', error);
        return [];
    }
}


export async function getAppRewards(params?: URLSearchParams): Promise<AppReward[]> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE_URL}/app-rewards/${queryString}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<AppReward>(data);
    } catch (error) {
        console.error('Failed to fetch app rewards:', error);
        return [];
    }
}

export async function getAppRewardDetail(slug: string): Promise<AppReward | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/app-rewards/${slug}/`, {
             cache: 'no-store', next: { tags: ['app-rewards'] }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch app reward detail:', error);
        return null;
    }
}

export async function getProducts(params?: URLSearchParams): Promise<Product[]> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE_URL}/products/${queryString}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<Product>(data);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

export async function getProductDetail(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/products/${slug}/`, {
            cache: 'no-store', next: { tags: ['products'] }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch product detail:', error);
        return null;
    }
}

export async function getDigitalAssets(params?: URLSearchParams): Promise<DigitalAsset[]> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE_URL}/digital-assets/${queryString}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<DigitalAsset>(data);
    } catch (error) {
        console.error('Failed to fetch digital assets:', error);
        return [];
    }
}

export async function getTrendingDigitalAssets(params?: URLSearchParams): Promise<DigitalAsset[]> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE_URL}/trending-digital-assets/${queryString}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<DigitalAsset>(data);
    } catch (error) {
        console.error('Failed to fetch trending digital assets:', error);
        return [];
    }
}

export async function getDigitalAssetDetail(slug: string): Promise<DigitalAsset | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/digital-assets/${slug}/`, {
            cache: 'no-store', next: { tags: ['digital-assets'] }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch digital asset detail:', error);
        return null;
    }
}

export async function getBlogPosts(params?: URLSearchParams): Promise<any[]> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const res = await fetch(`${API_BASE_URL}/blog/posts/${queryString}`, {
            cache: 'no-store' 
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<any>(data);
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

export async function getCategories(params?: URLSearchParams): Promise<Category[]> {
    try {
        const url = params ? `${API_BASE_URL}/categories/?${params.toString()}` : `${API_BASE_URL}/categories/`;
        const res = await fetch(url, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<Category>(data);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function getCountries(): Promise<any[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/countries/`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return ensureArray<any>(data);
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return [];
    }
}

// Authenticated Dashboard Endpoints
export async function getFinancialAnalytics(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/user/financial-analytics/`, token);
}

export async function getReferralInfo(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/auth/referral-info/`, token);
}

export async function getAdminDashboardStats(token: string): Promise<any> {
  return fetchWithAuth(`${API_BASE_URL}/admin/dashboard/stats/`, token);
}

export async function getFavoriteBrands(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/auth/favorites/`, token);
}



export async function getCashbackTransactions(token: string): Promise<any[]> {
    const data = await fetchWithAuth(`${API_BASE_URL}/cashback-transactions/`, token);
    return ensureArray<any>(data);
}

export async function getWithdrawalRequests(token: string): Promise<any[]> {
    const data = await fetchWithAuth(`${API_BASE_URL}/withdrawal-requests/`, token);
    return ensureArray<any>(data);
}

export async function getTrackingAnalytics(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/session/analytics/`, token);
}

export async function createWithdrawalRequest(token: string, data: any): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/withdrawal-requests/`, token, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// User Profile
export async function getUserProfile(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/auth/profile/`, token);
}

export async function updateUserProfile(token: string, profileData: any): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/auth/profile/`, token, {
        method: 'PATCH',
        body: JSON.stringify(profileData),
    });
}

export async function uploadProfilePicture(token: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('profile_pic', file);

    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error('Failed to upload profile picture');
    }
    return response.json();
}

export async function deleteAccount(token: string): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/auth/profile/`, token, {
        method: 'DELETE',
    });
}

export async function changePassword(token: string, data: any): Promise<any> {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        let errStr = "Failed to update password";
        try {
            const errJson = await response.json();
            if (errJson && errJson.detail) errStr = errJson.detail;
        } catch (e) {
            // fallback
        }
        throw new Error(errStr);
    }
    return response.json();
}

// Payment Methods
export async function getPaymentMethods(token: string): Promise<any[]> {
    const data = await fetchWithAuth(`${API_BASE_URL}/payment-methods/`, token);
    return ensureArray<any>(data);
}

export async function createPaymentMethod(token: string, data: any): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/payment-methods/`, token, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function deletePaymentMethod(token: string, id: number): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/payment-methods/${id}/`, token, {
        method: 'DELETE',
    });
}

// Brand Reviews
export async function createBrandReview(token: string, data: any): Promise<any> {
    return fetchWithAuth(`${API_BASE_URL}/reviews/`, token, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function trackClick(token: string | undefined, dealTitle: string): Promise<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(`${API_BASE_URL}/session/record-click/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ deal_title: dealTitle }),
    });
}

export async function searchGlobal(query: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch search results');
    }
    return response.json();
}

// Newsletter
export async function subscribeNewsletter(email: string) {
  const response = await fetch(`${API_BASE_URL}/newsletter/subscribe/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to subscribe');
  }
  return data;
}

// Helper to fetch all pages of a paginated API resource in parallel
async function fetchAllPages<T>(
  fetchPageFn: (params?: URLSearchParams) => Promise<T[] | { data: T[]; meta: any }>
): Promise<T[]> {
  // Fetch page 1 first to check count and get first chunk
  const firstPage = await fetchPageFn(new URLSearchParams({ page: '1' }));
  
  let results: T[] = [];
  let totalCount = 0;
  const pageSize = 24; // matches default PAGE_SIZE in backend settings.py
  
  if (Array.isArray(firstPage)) {
    results = [...firstPage];
    totalCount = (firstPage as any).count || firstPage.length;
  } else if (firstPage && 'data' in firstPage) {
    results = [...firstPage.data];
    totalCount = firstPage.meta?.total || firstPage.data.length;
  }
  
  const numPages = Math.ceil(totalCount / pageSize);
  if (numPages <= 1) {
    return results;
  }
  
  // Fetch pages 2 to N concurrently in parallel
  const pagePromises: Promise<T[] | { data: T[]; meta: any }>[] = [];
  for (let p = 2; p <= numPages; p++) {
    pagePromises.push(fetchPageFn(new URLSearchParams({ page: p.toString() })));
  }
  
  const pages = await Promise.all(pagePromises);
  for (const page of pages) {
    if (Array.isArray(page)) {
      results = results.concat(page);
    } else if (page && 'data' in page) {
      results = results.concat(page.data);
    }
  }
  
  return results;
}

// Scalable, parallel fetching of all products across all pages
export async function getAllProducts(): Promise<Product[]> {
  return fetchAllPages<Product>(getProducts);
}

// Scalable, parallel fetching of all brands across all pages
export async function getAllBrands(): Promise<BrandData[]> {
  return fetchAllPages<BrandData>(getBrands);
}

// Scalable, parallel fetching of all app rewards across all pages
export async function getAllAppRewards(): Promise<AppReward[]> {
  return fetchAllPages<AppReward>(getAppRewards);
}

// Scalable, parallel fetching of all blog posts across all pages
export async function getAllBlogPosts(): Promise<any[]> {
  return fetchAllPages<any>(getBlogPosts);
}

export async function getAllDigitalAssets(): Promise<DigitalAsset[]> {
  return fetchAllPages<DigitalAsset>(getDigitalAssets);
}
