export interface Product {
  id: string
  slug: string
  name: string
  brand: number | null
  brand_name?: string
  brand_slug?: string
  brand_name_manual?: string
  price: number
  original_price: number
  main_image?: string | null
  main_image_url?: string | null
  image_url?: string | null
  image?: string | null
  gallery?: string[]
  cashback_percentage: number
  cashback_amount?: number
  rating: number
  review_count?: number
  description: string
  short_highlights?: string[]
  availability: string
  category: number
  category_name?: string
  coupon_code?: string
}

export interface DigitalAsset {
    id: string;
    name: string;
    slug: string;
    brand: number | null;
    brand_name?: string;
    brand_slug?: string;
    brand_logo?: string;
    description: string;
    features: string[];
    price: number;
    previous_price?: number;
    cashback_percentage: number;
    access_type: string;
    access_type_display: string;
    plan_type: string;
    plan_type_display: string;
    platforms: string[];
    has_free_trial: boolean;
    trial_days: number;
    main_image: string;
    affiliate_url: string;
    category: number;
    category_name?: string;
    rating: number;
    review_count: number;
    is_verified: boolean;
    is_featured: boolean;
    coupon_code?: string;
    
    // UI Helpers (Standardized)
    title?: string;
    image?: string;
    image_url?: string | null;
    main_image_url?: string | null;
    originalPrice?: number;
    discountedPrice?: number;
    cashback?: number;
}

export interface BrandOffer {
  id: string;
  slug?: string;
  title: string;
  old_cashback: number;
  new_cashback: number;
  price: number;
  old_price: number;
  image: string;
  affiliate_link: string;
}

export interface BrandCoupon {
  id: string;
  title: string;
  code: string;
  description?: string;
  expiry: string;
  verified: boolean;
}

export interface BrandReview {
  id: string | number;
  user_name: string;
  user_avatar?: string | null;
  avatar_url?: string | null;
  user_photo?: string | null;
  rating: number;
  comment: string;
  date: string;
}

export interface RelatedStore {
  name: string;
  cashback_total: number;
  logo_url: string;
  slug: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
}

export interface BrandData {
  id: number;
  name: string;
  slug: string;
  updated_at?: string;
  logo_url: string;
  cover_image?: string;
  banner_url: string;
  cashback_total: number;
  cashback_previous: number;
  cashback_text?: string;
  exclusive: boolean;
  is_partner?: boolean;
  rating?: number | string | null;
  rating_count?: number | null;
  trustpilot_rating?: number | null;
  google_rating?: number | null;
  sitejabber_rating?: number | null;
  description: string;
  meta_description?: string;
  affiliate_link: string;
  terms: string[];
  offers: BrandOffer[];
  coupons: BrandCoupon[];
  holiday_deals: string[];
  reviews: BrandReview[];
  related_stores: RelatedStore[];
  countries?: Country[];
  categories?: number[];
  deals?: Deal[];
}

export interface AppReward {
  id: string;
  name: string;
  slug: string;
  brand: number | null;
  brand_name?: string;

  icon_url: string;
  category: number;
  category_name?: string;
  rating: number;
  reward_amount: number;
  reward_currency: string;
  description: string;
  verified: boolean;
  tags: Tag[];
  popularity: number;
  added_date: string;
  install_links: {
    ios?: string;
    android?: string;
    tracking?: string;
  };
  screenshots: string[];
  cashback_steps: {
    icon: string;
    title: string;
    description: string;
  }[];
  rules: string[];
  countries: Country[];
  disclaimer: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  image: string;
  brand: number | null;
  brand_name: string;
  brand_logo: string;
  brand_slug: string;
  /** Deal-specific cashback. Falls back to brand cashback if 0. */
  cashback_percentage: number;
  /** Always the brand's cashback_total from database */
  brand_cashback_total?: number;
  affiliate_url: string;
  category: number;
  popularity: number;
  /** Deal-level countries. Falls back to brand countries if empty. */
  countries: Country[];
  /** Always the brand's countries list from database */
  brand_countries?: Country[];
  coupon_code?: string;
  discount_display?: string;
  promo_id?: string;
  start_date?: string;
  end_date?: string;
  seo_banner?: string;
}

export interface PopularBrand {
    slug: string;
    name: string;
    logo: string;
    cashback_total?: number;
    cashback_previous?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  parent?: number;
}
