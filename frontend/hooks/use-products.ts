
// "use client"

// import { useState, useEffect } from "react"
// import useSWR from "swr"
// import { Product } from "@/data/mock-products"

// interface Filters {
//   categories: string[]
//   brands: string[]
//   priceRange: [number, number]
//   cashbackRange: string[]
//   rating: number | null
//   couponOnly: boolean
// }

// interface UseProductsProps {
//   query: string
//   filters: Filters
//   sort: string
//   page: number
// }

// interface ProductsResponse {
//   products: Product[]
//   total: number
//   pageSize: number
// }

// const fetcher = async (url: string) => {
//   // In a real app, you'd fetch from your API
//   // For now, we'll use the mock data
//   console.log("Fetching from:", url)
//   const { mockProducts } = await import("@/data/mock-products")
  
//   const urlParams = new URLSearchParams(url.split("?")[1])
//   const query = urlParams.get("q")?.toLowerCase() || ""
//   const categories = urlParams.get("category")?.split(",") || []
//   const brands = urlParams.get("brand")?.split(",") || []
//   const priceMin = parseFloat(urlParams.get("price_min") || "0")
//   const priceMax = parseFloat(urlParams.get("price_max") || "Infinity")
//   const ratingMin = parseFloat(urlParams.get("rating_min") || "0")
  
//   let filteredProducts = mockProducts.filter(p => {
//     const nameMatch = p.name.toLowerCase().includes(query)
//     const categoryMatch = categories.length === 0 || categories.includes(p.category)
//     const brandMatch = brands.length === 0 || brands.includes(p.brand)
//     const priceMatch = p.price >= priceMin && p.price <= priceMax
//     const ratingMatch = p.rating >= ratingMin
//     return nameMatch && categoryMatch && brandMatch && priceMatch && ratingMatch
//   })

//   // Sorting
//   const sort = urlParams.get("sort")
//   if (sort === "price-asc") {
//     filteredProducts.sort((a, b) => a.price - b.price)
//   } else if (sort === "price-desc") {
//     filteredProducts.sort((a, b) => b.price - a.price)
//   } else if (sort === "rating") {
//     filteredProducts.sort((a, b) => b.rating - a.rating)
//   }

//   const page = parseInt(urlParams.get("page") || "1")
//   const pageSize = 20
//   const total = filteredProducts.length
//   const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

//   return { products: paginatedProducts, total, pageSize }
// }

// export function useProducts({ query, filters, sort, page }: UseProductsProps) {
//   const [debouncedQuery, setDebouncedQuery] = useState(query)

//   // Debounce search query
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(query)
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [query])

//   // Build query params
//   const searchParams = new URLSearchParams()
//   if (debouncedQuery) searchParams.append("q", debouncedQuery)
//   if (filters.categories.length > 0) {
//     searchParams.append("category", filters.categories.join(","))
//   }
//   if (filters.brands.length > 0) {
//     searchParams.append("brand", filters.brands.join(","))
//   }
//   searchParams.append("price_min", filters.priceRange[0].toString())
//   searchParams.append("price_max", filters.priceRange[1].toString())
//   if (filters.cashbackRange.length > 0) {
//     searchParams.append("cashback", filters.cashbackRange.join(","))
//   }
//   if (filters.rating) {
//     searchParams.append("rating_min", filters.rating.toString())
//   }
//   if (filters.couponOnly) {
//     searchParams.append("coupon_only", "true")
//   }
//   searchParams.append("sort", sort)
//   searchParams.append("page", page.toString())

//   const url = `/api/products?${searchParams.toString()}`

//   const { data, error, isLoading } = useSWR<ProductsResponse>(url, fetcher, {
//     revalidateOnFocus: false,
//     dedupingInterval: 1000,
//   })

//   return {
//     products: data?.products || [],
//     total: data?.total || 0,
//     pageSize: data?.pageSize || 20,
//     isLoading: isLoading && !error,
//     error,
//   }
// }
// =======
"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"

interface Filters {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  cashbackRange: string[]
  rating: number | null
  couponOnly: boolean
  countries?: string[]
}

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  originalPrice?: number
  cashbackPercent: number
  discount?: number
  rating: number
  ratingCount: number
  hasCoupon: boolean
  coupon_code?: string
  countries?: Array<{ id: number, name: string, code: string }>
}

interface UseProductsProps {
  query: string
  filters: Filters
  sort: string
  page: number
}

interface ProductsResponse {
  products: Product[]
  total: number
  pageSize: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export function useProducts({ query, filters, sort, page }: UseProductsProps) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Build query params
  const searchParams = new URLSearchParams()
  if (debouncedQuery) searchParams.append("q", debouncedQuery)
  if (filters.categories.length > 0) {
    searchParams.append("category", filters.categories.join(","))
  }
  if (filters.brands.length > 0) {
    searchParams.append("brand", filters.brands.join(","))
  }
  searchParams.append("price_min", filters.priceRange[0].toString())
  searchParams.append("price_max", filters.priceRange[1].toString())
  if (filters.cashbackRange.length > 0) {
    searchParams.append("cashback", filters.cashbackRange.join(","))
  }
  if (filters.rating) {
    searchParams.append("rating_min", filters.rating.toString())
  }
  if (filters.couponOnly) {
    searchParams.append("coupon_only", "true")
  }
  if (filters.countries && filters.countries.length > 0) {
    searchParams.append("countries__code", filters.countries.join(","))
  }
  searchParams.append("sort", sort)
  searchParams.append("page", page.toString())

  // Mock API endpoint - replace with actual Django endpoint
  const url = `/api/products?${searchParams.toString()}`

  const { data, error, isLoading } = useSWR<ProductsResponse>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000,
  })

  return {
    products: data?.products || [],
    total: data?.total || 0,
    pageSize: data?.pageSize || 20,
    isLoading: isLoading && !error,
    error,
  }
}

