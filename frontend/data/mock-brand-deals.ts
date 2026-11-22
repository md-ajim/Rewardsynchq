export interface Brand {
  name: string;
  logo: string;
  slug: string;
}

export interface Deal {
  id: string;
  brandName: string;
  brandLogo: string;
  brandSlug: string;
  title: string;
  image: string;
  description: string;
  cashback: number;
  baseCashback: number;
  bonusCashback: number;
  affiliateUrl: string;
  category: string;
  popularity: number;
}

export const POPULAR_BRANDS: Brand[] = [
  { name: "Nike", logo: "/logos/Nike.jpg", slug: "nike" },
  { name: "Samsung", logo: "/logos/samsung-8.svg", slug: "samsung" },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: "1",
    brandName: "Nike",
    brandLogo: "/logos/Nike.jpg",
    brandSlug: "nike",
    title: "End of Season Sale - Up to 50% Off",
    image: "/images/deals/nike-sale.jpeg",
    description: "Get the best sports gear, shoes, and apparel.",
    cashback: 12,
    baseCashback: 8,
    bonusCashback: 4,
    affiliateUrl: "/cashback/brand/nike",
    category: "Fashion",
    popularity: 95,
  },
  {
    id: "2",
    brandName: "Samsung",
    brandLogo: "/logos/samsung-8.svg",
    brandSlug: "samsung",
    title: "New Galaxy S25 Launch Offer",
    image: "/images/deals/samsung-galaxy.jpg",
    description: "Pre-order the new Galaxy phone and get free buds.",
    cashback: 8.5,
    baseCashback: 6,
    bonusCashback: 2.5,
    affiliateUrl: "#",
    category: "Electronics",
    popularity: 92,
  },
];