"use client"
import { apiBaseUrl } from '@/lib/api-base'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const API_BASE_URL = apiBaseUrl()

export interface Favorite {
  id: number
  brand: number
  brand_name: string
  brand_slug: string
  brand_logo: string
  brand_cashback?: number
}

export function useFavorites() {
  const session = useSession()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.data?.accessToken) {
      setIsLoading(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/favorites/`, {
          headers: {
            'Authorization': `Bearer ${session.data.accessToken}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setFavorites(data)
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFavorites()
  }, [session])

  const toggleFavorite = async (brandId: number) => {
    if (!session?.data?.accessToken) return

    const isFavorited = favorites.some(f => f.brand === brandId)
    const method = isFavorited ? 'DELETE' : 'POST'
    
    // Optimistic UI update
    if (isFavorited) {
      setFavorites(prev => prev.filter(f => f.brand !== brandId))
    } else {
      setFavorites(prev => [...prev, { id: Date.now(), brand: brandId, brand_name: '', brand_slug: '', brand_logo: '' }])
    }

    try {
      await fetch(`${API_BASE_URL}/auth/favorites/`, {
        method,
        headers: {
          'Authorization': `Bearer ${session.data.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brand_id: brandId })
      })
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      // Rollback on error
      // In a real app, you'd want to refetch the favorites list
    }
  }

  return { favorites, toggleFavorite, isLoading }
}
