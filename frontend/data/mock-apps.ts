// This file would be placed under a 'data' folder
export interface AppData {
  id: number;
  name: string;
  brand: string;
  category: "Shopping" | "Finance" | "Entertainment" | "Lifestyle" | "Gaming";
  cashbackAmount: number; // in USD
  cashbackMax: number;
  tag: "Top Brand" | "New" | "Hot Deal" | null;
  logoUrl: string;
  popularity: number; // for sorting
  dateAdded: string; // for sorting
  rule?: string;
  rating?: number;
  isVerified?: boolean;
  isLimitedOffer?: boolean;
}

export const mockApps: AppData[] = [
  { id: 1, name: "ShopMax", brand: "Amazon", category: "Shopping", cashbackAmount: 5, cashbackMax: 10, tag: "Top Brand", logoUrl: "https://placehold.co/48/4f46e5/ffffff?text=SM", popularity: 5800, dateAdded: "2024-01-15" },
  { id: 2, name: "TuneStream", brand: "Spotify", category: "Entertainment", cashbackAmount: 3, cashbackMax: 5, tag: "Hot Deal", logoUrl: "https://placehold.co/48/10b981/ffffff?text=TS", popularity: 12000, dateAdded: "2024-02-01" },
  { id: 3, name: "WalletGo", brand: "PayPal", category: "Finance", cashbackAmount: 15, cashbackMax: 20, tag: "New", logoUrl: "https://img.freepik.com/premium-vector/google-wallet-logo_689336-957.jpg", popularity: 3500, dateAdded: "2024-05-20" },
  { id: 4, name: "FitLife", brand: "Nike", category: "Lifestyle", cashbackAmount: 2, cashbackMax: 8, tag: null, logoUrl: "https://placehold.co/48/ef4444/ffffff?text=FL", popularity: 400, dateAdded: "2024-03-10" },
  { id: 5, name: "GamerPro", brand: "Tencent", category: "Gaming", cashbackAmount: 10, cashbackMax: 15, tag: "Hot Deal", logoUrl: "https://image.winudf.com/v2/image1/Y29tLmdhbXJiZXRfaWNvbl8xNTYwMjUxNDkwXzAyNg/icon.png?w=184&fakeurl=1", popularity: 8200, dateAdded: "2024-04-05" },
  { id: 6, name: "BookHub", brand: "Google", category: "Entertainment", cashbackAmount: 1, cashbackMax: 3, tag: null, logoUrl: "https://placehold.co/48/7c3aed/ffffff?text=BH", popularity: 1500, dateAdded: "2024-05-25" },
];

export const categoriesList = Array.from(new Set(mockApps.map(app => app.category)));
export const brandsList = Array.from(new Set(mockApps.map(app => app.brand)));
// Cashback range is hardcoded for simplicity
export const MAX_CASHBACK = 20;