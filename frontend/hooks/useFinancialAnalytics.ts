"use client"
import { apiBaseUrl } from '@/lib/api-base'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const API_BASE_URL = apiBaseUrl()

export function useFinancialAnalytics() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/financial-analytics/`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` }
        })
        if (response.ok) setData(await response.json())
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [session])

  return { data, isLoading }
}
