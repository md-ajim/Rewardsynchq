
export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  category: string;
  cashback_base: number;
  cashback_bonus: number;
  cashback_total: number;
  is_featured: boolean;
  is_trending: boolean;
  active_offers_count: number;
  last_updated: string;
};

export const MOCK_BRANDS_POOL: Brand[] = [
  { id: 1201, name: "Nike", slug: "nike", logo_url: "/logos/Nike.jpg", category: "Fashion", cashback_base: 8, cashback_bonus: 4, cashback_total: 12, is_featured: true, is_trending: false, active_offers_count: 28, last_updated: "2025-10-30T12:00:00Z" },
  { id: 1202, name: "Samsung", slug: "samsung", logo_url: "/logos/samsung-8.svg", category: "Electronics", cashback_base: 6, cashback_bonus: 2, cashback_total: 8, is_featured: true, is_trending: true, active_offers_count: 15, last_updated: "2025-10-29T12:00:00Z" },
  { id: 1203, name: "Apple", slug: "apple", logo_url: "/logos/apple.svg", category: "Electronics", cashback_base: 3, cashback_bonus: 0, cashback_total: 3, is_featured: false, is_trending: true, active_offers_count: 5, last_updated: "2025-10-30T12:00:00Z" },
  { id: 1204, name: "Amazon", slug: "amazon", logo_url: "/logos/amazon.svg", category: "Home", cashback_base: 5, cashback_bonus: 1, cashback_total: 6, is_featured: false, is_trending: false, active_offers_count: 99, last_updated: "2025-10-28T12:00:00Z" },
  { id: 1205, name: "Expedia", slug: "expedia", logo_url: "/logos/expedia.svg", category: "Travel", cashback_base: 7, cashback_bonus: 3, cashback_total: 10, is_featured: true, is_trending: false, active_offers_count: 22, last_updated: "2025-10-30T12:00:00Z" },
  { id: 1206, name: "Sephora", slug: "sephora", logo_url: "/logos/sephora.svg", category: "Beauty", cashback_base: 9, cashback_bonus: 1, cashback_total: 10, is_featured: false, is_trending: true, active_offers_count: 18, last_updated: "2025-10-27T12:00:00Z" },
  { id: 1207, name: "Adidas", slug: "adidas", logo_url: "/logos/adidas.svg", category: "Fashion", cashback_base: 10, cashback_bonus: 0, cashback_total: 10, is_featured: false, is_trending: false, active_offers_count: 12, last_updated: "2025-10-30T12:00:00Z" },
  { id: 1208, name: "Booking.com", slug: "booking-com", logo_url: "/logos/booking.svg", category: "Travel", cashback_base: 6, cashback_bonus: 0, cashback_total: 6, is_featured: false, is_trending: false, active_offers_count: 8, last_updated: "2025-10-30T12:00:00Z" },
];

export const allMockBrands: Brand[] = Array.from({ length: 100 }, (_, i) => 
  MOCK_BRANDS_POOL.map((brand, j) => ({
    ...brand,
    id: brand.id + i * 100 + j,
    name: `${brand.name} ${i > 0 ? i : ''}`.trim(),
    slug: `${brand.slug}${i > 0 ? `-${i}` : ''}`,
  }))
).flat();
