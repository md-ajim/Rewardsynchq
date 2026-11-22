
export interface Deal {
    id: number;
    title: string;
    brand: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    cashback: number;
    category: string;
    verified: boolean;
    trending: boolean;
    rating: number;
    reviews: number;
  }
  
  export const MOCK_DEALS: Deal[] = [
    {
      id: 1,
      title: "Wireless Bluetooth Headphones Pro",
      brand: "SoundMax",
      image: "/wireless-headphones.png",
      originalPrice: 299.99,
      discountedPrice: 149.99,
      discount: 50,
      cashback: 5,
      category: "Electronics",
      verified: true,
      trending: true,
      rating: 4.8,
      reviews: 256,
    },
    {
      id: 2,
      title: "Premium Skincare Serum",
      brand: "LuxBio",
      image: "/skincare-serum.jpg",
      originalPrice: 89.99,
      discountedPrice: 44.99,
      discount: 50,
      cashback: 8,
      category: "Beauty",
      verified: true,
      trending: false,
      rating: 4.6,
      reviews: 189,
    },
    {
      id: 3,
      title: "Winter Parka Jacket",
      brand: "FashionHub",
      image: "/winter-jacket.png",
      originalPrice: 199.99,
      discountedPrice: 99.99,
      discount: 50,
      cashback: 3,
      category: "Fashion",
      verified: true,
      trending: false,
      rating: 4.7,
      reviews: 412,
    },
    {
      id: 4,
      title: "Smart Watch Ultra",
      brand: "TechGear",
      image: "/modern-smartwatch.png",
      originalPrice: 349.99,
      discountedPrice: 174.99,
      discount: 50,
      cashback: 6,
      category: "Electronics",
      verified: true,
      trending: true,
      rating: 4.9,
      reviews: 534,
    },
    {
      id: 5,
      title: "Organic Protein Powder",
      brand: "NutraFit",
      image: "/protein-powder.jpg",
      originalPrice: 59.99,
      discountedPrice: 29.99,
      discount: 50,
      cashback: 4,
      category: "Health & Wellness",
      verified: true,
      trending: false,
      rating: 4.5,
      reviews: 278,
    },
    {
      id: 6,
      title: "Running Shoes Pro",
      brand: "SportX",
      image: "/running-shoes.jpg",
      originalPrice: 129.99,
      discountedPrice: 64.99,
      discount: 50,
      cashback: 5,
      category: "Sports",
      verified: true,
      trending: false,
      rating: 4.7,
      reviews: 356,
    },
    {
      id: 7,
      title: "4K Webcam",
      brand: "ProVision",
      image: "/classic-webcam.png",
      originalPrice: 199.99,
      discountedPrice: 89.99,
      discount: 55,
      cashback: 7,
      category: "Electronics",
      verified: true,
      trending: true,
      rating: 4.8,
      reviews: 189,
    },
    {
      id: 8,
      title: "Yoga Mat Premium",
      brand: "ZenFlow",
      image: "/rolled-yoga-mat.png",
      originalPrice: 49.99,
      discountedPrice: 24.99,
      discount: 50,
      cashback: 3,
      category: "Sports",
      verified: true,
      trending: false,
      rating: 4.6,
      reviews: 145,
    },
  ];
