// lib/mockData.ts
import { AppReward } from '@/lib/types';

export const MOCK_APPS: any[] = [
  {
    id: '1',
    name: 'AliExpress',
    brand: 'Alibaba Group',
    icon_url: 'https://img.logoipsum.com/243.svg', // Placeholder
    category: 'Shopping',
    rating: 4.5,
    reward_amount: 120,
    reward_currency: '৳',
    description: 'Install and make one purchase to earn.',
    verified: true,
    tags: ['Hot Deal'],
    popularity: 90,
    added_date: '2025-10-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Spotify',
    brand: 'Spotify AB',
    icon_url: 'https://img.logoipsum.com/245.svg',
    category: 'Entertainment',
    rating: 4.8,
    reward_amount: 50,
    reward_currency: '৳',
    description: 'Install and subscribe to any plan.',
    verified: true,
    tags: [],
    popularity: 95,
    added_date: '2025-10-18T10:00:00Z',
  },
  {
    id: '3',
    name: 'Paytm',
    brand: 'One97 Communications',
    icon_url: 'https://img.logoipsum.com/246.svg',
    category: 'Finance',
    rating: 4.2,
    reward_amount: 80,
    reward_currency: '৳',
    description: 'Install, sign up, and complete KYC.',
    verified: true,
    tags: ['Limited Offer'],
    popularity: 80,
    added_date: '2025-10-22T10:00:00Z',
  },
  {
    id: '4',
    name: 'Candy Crush',
    brand: 'King',
    icon_url: 'https://img.logoipsum.com/248.svg',
    category: 'Games',
    rating: 4.6,
    reward_amount: 200,
    reward_currency: 'Points',
    description: 'Install and reach Level 50.',
    verified: false,
    tags: ['Hot Deal'],
    popularity: 85,
    added_date: '2025-10-01T10:00:00Z',
  },
  // ... add more mock apps
];

export const MOCK_BRANDS = [
  { name: 'Amazon', logo: 'https://img.logoipsum.com/224.svg' },
  { name: 'Spotify', logo: 'https://img.logoipsum.com/245.svg' },
  { name: 'Netflix', logo: 'https://img.logoipsum.com/225.svg' },
  { name: 'Paytm', logo: 'https://img.logoipsum.com/246.svg' },
  { name: 'Flipkart', logo: 'https://img.logoipsum.com/226.svg' },
  { name: 'Uber', logo: 'https://img.logoipsum.com/227.svg' },
  { name: 'Zomato', logo: 'https://img.logoipsum.com/228.svg' },
];


// lib/mockData.ts

export interface AppDetails {
  id: string;
  slug: string;
  name: string;

  iconUrl: string;
  rating: number;
  category: string;
  installLinks: {
    ios: string;
    android: string;
  };
  screenshots: string[];
  description: string;
  cashbackSteps: {
    icon: 'Download' | 'CheckSquare' | 'Wallet';
    title: string;
    description: string;
  }[];
  rules: string[];
  availableCountries: {
    name: string;
    flag: string;
    localRate: string;
  }[];
  relatedApps: {
    id: string;
    name: string;
    iconUrl: string;
    slug: string;
  }[];
  disclaimer: string;
}

export const getAppDetails = async (slug: string): Promise<AppDetails> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return mock data
  return {
    id: '1',
    slug: 'aliexpress',
    name: 'AliExpress Shopping App',

    iconUrl: 'https://img.logoipsum.com/243.svg', // Placeholder
    rating: 4.8,
    category: 'Shopping',
    installLinks: {
      ios: 'https://apps.apple.com/us/app/aliexpress/idid12345',
      android: 'https://play.google.com/store/apps/details?id=com.alibaba.aliexpress',
    },
    screenshots: [
      'https://picsum.photos/seed/p1/500/300',
      'https://picsum.photos/seed/p2/500/300',
      'https://picsum.photos/seed/p3/500/300',
      'https://picsum.photos/seed/p4/500/300',
    ],
    description:
      'Discover millions of items at low prices. AliExpress is your one-stop shop for everything from fashion to electronics. Complete simple tasks to earn cashback on your purchases.',
    cashbackSteps: [
      {
        icon: 'Download',
        title: 'Step 1: Install the App',
        description: 'Use the links on this page to install the app on your device.',
      },
      {
        icon: 'CheckSquare',
        title: 'Step 2: Sign Up & Purchase',
        description: 'Create a new account and make your first qualifying purchase.',
      },
      {
        icon: 'Wallet',
        title: 'Step 3: Get Cashback',
        description: 'Your cashback will be added to your RewardSyncHQ wallet in 24 hours.',
      },
    ],
    rules: [
      'Cashback is for new users only.',
      'You must complete your first purchase within 7 days.',
      'Using an external coupon code may void your cashback.',
      'Cashback confirmed after 30-day return period.',
    ],
    availableCountries: [
      { name: 'United States', flag: '🇺🇸', localRate: 'Up to 12%' },
      { name: 'United Kingdom', flag: '🇬🇧', localRate: 'Up to 10%' },
      { name: 'India', flag: '🇮🇳', localRate: 'Up to 150 INR' },
      { name: 'Bangladesh', flag: '🇧🇩', localRate: 'Up to 120 BDT' },
      { name: 'Canada', flag: '🇨🇦', localRate: 'Up to 10%' },
      { name: 'Australia', flag: '🇦🇺', localRate: 'Up to 8%' },
    ],
    relatedApps: [
      { id: '2', name: 'Amazon', iconUrl: 'https://img.logoipsum.com/224.svg', slug: 'amazon' },
      { id: '3', name: 'Daraz', iconUrl: 'https://img.logoipsum.com/225.svg', slug: 'daraz' },
      { id: '4', name: 'Spotify', iconUrl: 'https://img.logoipsum.com/226.svg', slug: 'spotify' },
    ],
    disclaimer:
      'Cashback rates and availability are subject to change and may vary by country. Please review all terms before installing.',
  };
};