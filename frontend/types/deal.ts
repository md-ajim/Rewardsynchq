export interface Deal {
  id: number;
  title: string;
  category: string;
  brand: string;
  image_url: string;
  description: string;
  old_price: number;
  current_price: number;
  discount_percent: number;
  cashback: number;
  coupon?: string;
  affiliate_link: string;
  verified_at: string;
  expires_at: string;
  views: number;
  saves: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  discount?: number;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}