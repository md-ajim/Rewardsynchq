"use client"
import { apiBaseUrl } from '@/lib/api-base'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const API_BASE_URL = apiBaseUrl()

interface Balances {
  available: number
  pending_cashback: number
  pending_payouts: number
  total_earned: number
  total_withdrawn: number
}

export interface Transaction {
  id: string
  orderId: string
  merchant: string
  amount: number
  cashback: number
  status: "pending" | "approved" | "paid"
  date: string
  expectedPayout: string
}

export interface Withdraw {
  id: string
  amount: number
  method: string
  status: "pending" | "processing" | "completed"
  requestDate: string
  completedDate?: string
  transactionRef: string
}

export function useCashback() {
  const session = useSession()
  const [balances, setBalances] = useState<Balances | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [withdraws, setWithdraws] = useState<Withdraw[] | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = () => {
    setIsLoading(true)
  }

  useEffect(() => {
    if (!session?.data?.accessToken) {
        setIsLoading(false)
        return
    }

    const fetchCashbackData = async () => {
      try {
        setIsLoading(true)

        const headers = {
            'Authorization': `Bearer ${session.data.accessToken}`,
            'Content-Type': 'application/json'
        }

        const [txRes, wdRes, pmRes] = await Promise.all([
            fetch(`${API_BASE_URL}/cashback-transactions/`, { headers }),
            fetch(`${API_BASE_URL}/withdrawal-requests/`, { headers }),
            fetch(`${API_BASE_URL}/payment-methods/`, { headers })
        ])

        if (!txRes.ok || !wdRes.ok || !pmRes.ok) throw new Error("Failed to fetch cashback data")

        const txData = await txRes.json()
        const wdData = await wdRes.json()
        const pmData = await pmRes.json()

        const backendTransactions = Array.isArray(txData) ? txData : (txData.results || [])
        const backendWithdrawals = Array.isArray(wdData) ? wdData : (wdData.results || [])
        const backendPaymentMethods = Array.isArray(pmData) ? pmData : (pmData.results || [])

        // Map backend transactions to frontend format
        const mappedTransactions: Transaction[] = backendTransactions.map((tx: any) => ({
            id: tx.id.toString(),
            orderId: tx.source_id || 'N/A',
            merchant: tx.source_name,
            amount: 0, // Backend might not have original amount in this model
            cashback: Number(tx.amount),
            status: tx.status.toLowerCase() === 'confirmed' ? 'approved' : 'pending',
            date: tx.created_at.split('T')[0],
            expectedPayout: 'Pending Clearance'
        }))

        // Map backend withdrawals to frontend format
        const mappedWithdraws: Withdraw[] = backendWithdrawals.map((wd: any) => ({
            id: wd.id.toString(),
            amount: Number(wd.amount),
            method: wd.payment_method,
            status: wd.status.toLowerCase() as any,
            requestDate: wd.requested_at.split('T')[0],
            completedDate: wd.processed_at ? wd.processed_at.split('T')[0] : undefined,
            transactionRef: wd.id.toString()
        }))

        // Calculate Balances
        const pending_cashback = mappedTransactions
            .filter(t => t.status === 'pending')
            .reduce((sum, t) => sum + t.cashback, 0)
        
        const approved = mappedTransactions
            .filter(t => t.status === 'approved' || t.status === 'paid')
            .reduce((sum, t) => sum + t.cashback, 0)

        const total_withdrawn = mappedWithdraws
            .filter(w => w.status === 'completed')
            .reduce((sum, w) => sum + w.amount, 0)

        const pending_payouts = mappedWithdraws
            .filter(w => w.status === 'pending' || w.status === 'processing')
            .reduce((sum, w) => sum + w.amount, 0)

        // Available balance MUST deduct both completed and pending/processing withdrawals
        const available = approved - total_withdrawn - pending_payouts

        setBalances({
          available: Math.max(0, available),
          pending_cashback: pending_cashback,
          pending_payouts: pending_payouts,
          total_earned: approved + pending_cashback,
          total_withdrawn: total_withdrawn,
        })

        setTransactions(mappedTransactions)
        setWithdraws(mappedWithdraws)
        
        const mappedPaymentMethods = backendPaymentMethods.map((pm: any) => ({
          id: pm.id.toString(),
          type: pm.method_type === 'PAYPAL' ? 'PayPal' : pm.method_type === 'PAYONEER' ? 'Payoneer' : 'Bank',
          ...pm.details
        }))
        setPaymentMethods(mappedPaymentMethods)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cashback data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCashbackData()
  }, [session])

  return { balances, transactions, withdraws, paymentMethods, isLoading, error, refetch }
}
