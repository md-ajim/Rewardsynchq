
import {
    DollarSign,
    Tag,
    Heart,
    Users,
  } from "lucide-react";
  
  export const summaryStats = [
    {
      title: "Total Cashback",
      value: "$128.50",
      icon: DollarSign,
      color: "text-accent",
    },
    {
      title: "Active Deals",
      value: "12",
      icon: Tag,
      color: "text-primary",
    },
    {
      title: "Saved Deals",
      value: "34",
      icon: Heart,
      color: "text-pink-500",
    },
    {
      title: "Referrals",
      value: "5",
      icon: Users,
      color: "text-purple-500",
    },
  ];
  
  export const cashbackData = [
    { month: "Jan", earnings: 24 },
    { month: "Feb", earnings: 36 },
    { month: "Mar", earnings: 68 },
    { month: "Apr", earnings: 55 },
    { month: "May", earnings: 89 },
    { month: "Jun", earnings: 128 },
  ];
  
  export type Deal = {
    id: string;
    title: string;
    brand: string;
    clicks: number;
    cashback: string;
    status: "Pending" | "Confirmed" | "Rejected";
  };
  
  export const dealsData: Deal[] = [
    {
      id: "d1",
      title: "Summer Sale - 50% Off",
      brand: "Nike",
      clicks: 120,
      cashback: "8%",
      status: "Confirmed",
    },
    {
      id: "d2",
      title: "Flash Deal - Laptops",
      brand: "Dell",
      clicks: 45,
      cashback: "$25",
      status: "Pending",
    },
    {
      id: "d3",
      title: "BOGO Free",
      brand: "Starbucks",
      clicks: 88,
      cashback: "5%",
      status: "Pending",
    },
    {
      id: "d4",
      title: "Expired Tech Deal",
      brand: "Samsung",
      clicks: 210,
      cashback: "10%",
      status: "Rejected",
    },
  ];
  
  export const savedDeals = [
    {
      id: "s1",
      title: "Noise-Cancelling Headphones",
      brand: "Sony",
      discount: "30% Off",
      image: "https://placehold.co/300x200?text=Sony+Headphones",
    },
    {
      id: "s2",
      title: "Running Shoes",
      brand: "Adidas",
      discount: "$20 Off",
      image: "https://placehold.co/300x200?text=Adidas+Shoes",
    },
    {
      id: "s3",
      title: "Smart Home Hub",
      brand: "Google",
      discount: "15% Off",
      image: "https://placehold.co/300x200?text=Google+Home",
    },
  ];
  
  export const dailyClicksData = [
    { day: "Mon", clicks: 14 },
    { day: "Tue", clicks: 25 },
    { day: "Wed", clicks: 31 },
    { day: "Thu", clicks: 28 },
    { day: "Fri", clicks: 42 },
    { day: "Sat", clicks: 50 },
    { day: "Sun", clicks: 35 },
  ];
  
  export const conversionRateData = [{ name: "Conversion", value: 62, fill: "#007AFF" }];
  
  export const categoriesData = [
    { name: "Electronics", value: 45, fill: "#007AFF" },
    { name: "Fashion", value: 30, fill: "#00C853" },
    { name: "Home", value: 25, fill: "#FF9500" },
  ];
  
  export const navItems = [
    { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
    { label: "My Deals", icon: "Tag", href: "/dashboard/deals" },
    { label: "Saved Deals", icon: "Heart", href: "/dashboard/saved" },
    { label: "Referrals", icon: "Share2", href: "/dashboard/referrals" },
    { label: "Settings", icon: "Settings", href: "/dashboard/settings" },
    { label: "Logout", icon: "LogOut", href: "/api/auth/signout" },
  ];
