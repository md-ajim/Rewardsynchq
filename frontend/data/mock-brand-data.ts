
import { BrandData } from '@/lib/types';

export const mockBrandData: BrandData[] = [
  {
    id: 12,
    name: 'AliExpress',
    slug: 'aliexpress',
    logo_url: 'https://img.logoipsum.com/243.svg', // Placeholder
    banner_url: 'https://picsum.photos/1600/400?grayscale&blur=2', // Placeholder
    cashback_total: 12,
    cashback_previous: 2,
    exclusive: true,
    description:
      'AliExpress is one of the world’s leading online retail marketplaces offering millions of products from fashion to electronics with international shipping and great cashback deals through RewardSyncHQ.',
    affiliate_link: 'https://RewardSyncHQ.com/go/aliexpress',
    terms: [
      'Cashback not available on bulk, wholesale, or reseller orders.',
      'Not valid on gift cards or purchases made with gift cards.',
      'Cashback may not apply if other coupon codes are used.',
      'Orders must be completed within the same browsing session.',
    ],
    offers: [
      {
        id: 'o1',
        title: 'Hover-1 Falcon-1 Stroller Accessory',
        old_cashback: 2,
        new_cashback: 12,
        price: 38.23,
        old_price: 115.85,
        image: 'https://picsum.photos/300/300?random=1',
        affiliate_link: 'https://RewardSyncHQ.com/go/aliexpress/offer1',
      },
      {
        id: 'o2',
        title: 'Wireless Bluetooth Earbuds Pro',
        old_cashback: 3,
        new_cashback: 12,
        price: 19.99,
        old_price: 49.99,
        image: 'https://picsum.photos/300/300?random=2',
        affiliate_link: 'https://RewardSyncHQ.com/go/aliexpress/offer2',
      },
      {
        id: 'o3',
        title: 'Smart Home Security Camera 1080p',
        old_cashback: 2.5,
        new_cashback: 12,
        price: 25.5,
        old_price: 60.0,
        image: 'https://picsum.photos/300/300?random=3',
        affiliate_link: 'https://RewardSyncHQ.com/go/aliexpress/offer3',
      },
    ],
    coupons: [
      {
        id: 'c1',
        title: 'Get $10 off orders over $100',
        code: 'DEAL10',
        expiry: '2025-12-31T23:59:59Z',
        verified: true,
      },
      {
        id: 'c2',
        title: 'New User Special: $5 Off',
        code: 'NEW5',
        expiry: '2025-11-30T23:59:59Z',
        verified: false,
      },
    ],
    holiday_deals: [
      'Black Friday',
      'Cyber Monday',
      'Holiday Gifts',
      'Presidents\' Day',
      'Labor Day',
    ],
    reviews: [
      {
        id: 'r1',
        user_name: 'John D.',
        rating: 5,
        comment: 'Great cashback! Got it credited in 30 days.',
        date: '2025-10-15T09:30:00Z',
      },
      {
        id: 'r2',
        user_name: 'Sarah K.',
        rating: 4,
        comment: 'Worked as expected, but tracking was a bit slow.',
        date: '2025-10-12T14:22:00Z',
      },
    ],
    related_stores: [
      {
        name: 'Amazon',
        cashback_total: 10,
        logo_url: 'https://img.logoipsum.com/224.svg',
        slug: 'amazon',
      },
      {
        name: 'Banggood',
        cashback_total: 8,
        logo_url: 'https://img.logoipsum.com/225.svg',
        slug: 'banggood',
      },
      {
        name: 'Walmart',
        cashback_total: 5,
        logo_url: 'https://img.logoipsum.com/226.svg',
        slug: 'walmart',
      },
      {
        name: 'eBay',
        cashback_total: 9,
        logo_url: 'https://img.logoipsum.com/227.svg',
        slug: 'ebay',
      },
    ],
  },
  {
    id: 1,
    name: 'Nike',
    slug: 'nike',
    logo_url: '/logos/Nike.jpg', // Placeholder
    banner_url: 'https://picsum.photos/1600/400?grayscale&blur=2', // Placeholder
    cashback_total: 15,
    cashback_previous: 10,
    exclusive: false,
    description:
      'Nike is a global leader in athletic footwear, apparel and equipment. Get the best deals and cashback on the latest Nike products.',
    affiliate_link: 'https://RewardSyncHQ.com/go/nike',
    terms: [
      'Cashback is not available on Nike gift cards.',
      'Cashback may not be available on certain limited edition products.',
    ],
    offers: [
        {
            id: 'o4',
            title: 'Nike Air Max 270',
            old_cashback: 5,
            new_cashback: 15,
            price: 150,
            old_price: 170,
            image: 'https://picsum.photos/300/300?random=4',
            affiliate_link: 'https://RewardSyncHQ.com/go/nike/offer4',
        },
    ],
    coupons: [],
    holiday_deals: [
      'Black Friday',
      'Cyber Monday',
    ],
    reviews: [],
    related_stores: [
        {
            name: 'Adidas',
            cashback_total: 12,
            logo_url: '/logos/adidas.svg',
            slug: 'adidas',
        },
    ],
  },
];
