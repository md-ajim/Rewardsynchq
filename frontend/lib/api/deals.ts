import { apiBaseUrl } from '@/lib/api-base'
const API_BASE_URL = apiBaseUrl()

export async function getDeal(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/deals/${id}/`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const data = await res.json()
    
    // Map backend Deal to frontend format if necessary
    return {
        ...data,
        id: data.id,
        title: data.title,
        image_url: data.image,
        current_price: Number(data.price),
        old_price: Number(data.original_price),
        discount_percent: Math.round(((data.original_price - data.price) / data.original_price) * 100),
        cashback: Number(data.cashback_percentage),
        affiliate_link: data.affiliate_url,
    }
  } catch (error) {
    console.error('Error fetching deal:', error)
    return null
  }
}

export async function getPriceHistory(dealId: string | number) {
  // Backend doesn't have price history model yet, returning empty or simulated
  return [
    { date: new Date().toISOString().split('T')[0], price: 299 },
  ];
}

export async function getReviews(dealId: string | number) {
  // Using Brand reviews as a fallback or return empty
  return [];
}
