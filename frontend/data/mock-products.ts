
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  cashbackPercentage: number;
  cashbackAmount?: number;
  rating: number;
  reviewCount?: number;
  description?: string;
  availability: string;
  category: string;
  categoryPath?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "classic-wireless-headphones",
    name: "Classic Wireless Headphones",
    brand: "SoundWave",
    price: 129.99,
    originalPrice: 149.99,
    image: "/headphones-details.jpg",
    images: [
      "/headphones-details.jpg",
      "/headphones-side-view.png",
    ],
    cashbackPercentage: 10,
    cashbackAmount: 13.0,
    rating: 4.5,
    reviewCount: 150,
    description: "Experience crystal-clear audio with our new wireless headphones. Features noise-cancellation and a 20-hour battery life.",
    availability: "In Stock",
    category: "Electronics",
    categoryPath: ["Electronics", "Audio", "Headphones"],
  },
  {
    id: "2",
    slug: "pro-gaming-laptop",
    name: "Pro Gaming Laptop",
    brand: "GameOn",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "/black-friday-laptop.jpg",
    cashbackPercentage: 15,
    rating: 4.8,
    reviewCount: 450,
    description: "Dominate the competition with this high-performance gaming laptop. Featuring the latest GPU and a 144Hz display.",
    availability: "In Stock",
    category: "Electronics",
    categoryPath: ["Electronics", "Computers", "Laptops"],
  },
  {
    id: "3",
    slug: "smart-home-hub",
    name: "Smart Home Hub",
    brand: "Connectify",
    price: 89.99,
    image: "/classic-webcam.png",
    cashbackPercentage: 5,
    rating: 4.2,
    reviewCount: 200,
    description: "Control all your smart devices from one central hub. Compatible with Alexa, Google Assistant, and more.",
    availability: "Out of Stock",
    category: "Smart Home",
    categoryPath: ["Smart Home", "Hubs & Controllers"],
  },
  {
    id: "4",
    slug: "vintage-leather-watch",
    name: "Vintage Leather Watch",
    brand: "Timeless",
    price: 249.99,
    image: "/fashion-clothing-store.png",
    cashbackPercentage: 20,
    cashbackAmount: 50.0,
    rating: 4.7,
    reviewCount: 320,
    description: "A classic timepiece that never goes out of style. Made with genuine leather and a stainless steel case.",
    availability: "In Stock",
    category: "Fashion",
    categoryPath: ["Fashion", "Accessories", "Watches"],
  },
  {
    id: "5",
    slug: "organic-cotton-t-shirt",
    name: "Organic Cotton T-Shirt",
    brand: "EcoWear",
    price: 24.99,
    image: "/lush-home-garden.png",
    cashbackPercentage: 2,
    rating: 4.9,
    reviewCount: 800,
    description: "Soft, comfortable, and eco-friendly. This t-shirt is made from 100% organic cotton.",
    availability: "In Stock",
    category: "Fashion",
    categoryPath: ["Fashion", "Apparel", "T-Shirts"],
  },
];
