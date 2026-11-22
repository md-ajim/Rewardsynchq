// import { useQuery } from '@tanstack/react-query';

// import { useRealtimeUpdates } from './useRealtimeUpdates';

// // Types
// export interface CashbackTransaction {
//   id: string;
//   merchant: string;
//   amount: number;
//   status: 'pending' | 'approved' | 'paid';
//   purchaseDate: string;
//   estimatedClearanceDate?: string;
// }

// export interface CashbackData {
//   stats: {
//     total: number;
//     available: number;
//     pending: number;
//     lifetime: number;
//   };
//   summary: {
//     availableBalance: number;
//     thisMonth: number;
//     lastMonth: number;
//   };
//   transactions: CashbackTransaction[];
//   pendingTransactions: CashbackTransaction[];
// }

// // Mock data for development
// const mockCashbackData: CashbackData = {
//   stats: {
//     total: 245.67,
//     available: 156.89,
//     pending: 88.78,
//     lifetime: 1245.32,
//   },
//   summary: {
//     availableBalance: 156.89,
//     thisMonth: 45.23,
//     lastMonth: 67.89,
//   },
//   transactions: [
//     {
//       id: '1',
//       merchant: 'Amazon',
//       amount: 12.45,
//       status: 'paid',
//       purchaseDate: '2024-01-15',
//     },
//     {
//       id: '2',
//       merchant: 'Walmart',
//       amount: 8.67,
//       status: 'approved',
//       purchaseDate: '2024-01-12',
//     },
//     {
//       id: '3',
//       merchant: 'Target',
//       amount: 15.23,
//       status: 'pending',
//       purchaseDate: '2024-01-10',
//       estimatedClearanceDate: '2024-01-24',
//     },
//   ],
//   pendingTransactions: [
//     {
//       id: '3',
//       merchant: 'Target',
//       amount: 15.23,
//       status: 'pending',
//       purchaseDate: '2024-01-10',
//       estimatedClearanceDate: '2024-01-24',
//     },
//     {
//       id: '4',
//       merchant: 'Best Buy',
//       amount: 22.45,
//       status: 'pending',
//       purchaseDate: '2024-01-08',
//       estimatedClearanceDate: '2024-01-22',
//     },
//   ],
// };

// // API endpoints to wire to DRF
// /*
// GET /api/cashback/summary/
// GET /api/cashback/transactions/
// GET /api/cashback/stats/
// GET /api/cashback/pending/
// */

// const fetchCashbackData = async (): Promise<CashbackData> => {
//   // In production, replace with actual API calls
//   const response = await fetch('/api/cashback/summary/', {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch cashback data');
//   }

//   // For now, return mock data
//   return mockCashbackData;
// };

// export const useCashback = () => {
//   const query = useQuery({
//     queryKey: ['cashback'],
//     queryFn: fetchCashbackData,
//     refetchInterval: 30000, // Refetch every 30 seconds
//     staleTime: 10000, // Consider data stale after 10 seconds
//   });

//   // Enable real-time updates for pending transactions
//   useRealtimeUpdates(query.data?.pendingTransactions || []);

//   return query;
// };

"use client"

import { useState, useEffect } from "react"

interface Balances {
  available: number
  pending: number
  total_earned: number
  total_withdrawn: number
}

interface Transaction {
  id: string
  orderId: string
  merchant: string
  amount: number
  cashback: number
  status: "pending" | "approved" | "paid"
  date: string
  expectedPayout: string
}

interface Withdraw {
  id: string
  amount: number
  method: string
  status: "pending" | "processing" | "completed"
  requestDate: string
  completedDate?: string
  transactionRef: string
}

export function useCashback() {
  const [balances, setBalances] = useState<Balances | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [withdraws, setWithdraws] = useState<Withdraw[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        setIsLoading(true)

        // TODO: Replace with actual API calls to:
        // GET /api/dashboard/cashback/
        // GET /api/dashboard/cashback/transactions/?page=1
        // GET /api/dashboard/cashback/withdraws/

        // Mock data for development
        const mockBalances: Balances = {
          available: 145.5,
          pending: 89.25,
          total_earned: 342.75,
          total_withdrawn: 108.0,
        }

        const mockTransactions: Transaction[] = [
          {
            id: "TXN001",
            orderId: "ORD-123456",
            merchant: "Amazon",
            amount: 79.99,
            cashback: 4.0,
            status: "approved",
            date: "2024-11-25",
            expectedPayout: "2024-12-25",
          },
          {
            id: "TXN002",
            orderId: "ORD-123457",
            merchant: "eBay",
            amount: 149.99,
            cashback: 15.0,
            status: "pending",
            date: "2024-11-23",
            expectedPayout: "2024-12-23",
          },
        ]

        const mockWithdraws: Withdraw[] = [
          {
            id: "WD001",
            amount: 50.0,
            method: "PayPal",
            status: "completed",
            requestDate: "2024-11-20",
            completedDate: "2024-11-25",
            transactionRef: "PP-123456789",
          },
        ]

        await new Promise((resolve) => setTimeout(resolve, 500))

        setBalances(mockBalances)
        setTransactions(mockTransactions)
        setWithdraws(mockWithdraws)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cashback data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCashbackData()
  }, [])

  return { balances, transactions, withdraws, isLoading, error }
}
