"use client"
import { apiBaseUrl } from '@/lib/api-base'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const API_BASE_URL = apiBaseUrl()

export interface Referral {
  id: number
  username: string
  date_joined: string
  total_earnings?: number
}

export interface ReferralInfo {
  referral_code: string
  referral_link: string
  referrals: Referral[]
}

export function useReferral() {
  const session = useSession()
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.data?.accessToken) {
        setIsLoading(false)
        return
    }

    const fetchReferralData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/auth/referral-info/`, {
            headers: {
                'Authorization': `Bearer ${session.data.accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) throw new Error("Failed to fetch referral data")
        const data = await response.json()
        setReferralInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch referral data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferralData()
  }, [session])

  return { referralInfo, isLoading, error }
}
