import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
    getFinancialAnalytics, 
    getReferralInfo, 
    getFavoriteBrands, 
    getCashbackTransactions,
    getWithdrawalRequests,
    getUserProfile,
    getPaymentMethods
} from '@/lib/api';

export function useDashboardData() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<{
        financials: any;
        referral: any;
        favorites: any[];
        recentTransactions: any[];
        withdrawalRequests: any[];
        profile: any;
        paymentMethods: any[];
    } | null>(null);

    const fetchAllData = useCallback(async () => {
        if (status !== 'authenticated' || !session?.accessToken) {
            if (status === 'unauthenticated') setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const token = session.accessToken as string;

            const [financials, referral, favorites, transactions, withdrawals, profile, paymentMethods] = await Promise.all([
                getFinancialAnalytics(token),
                getReferralInfo(token),
                getFavoriteBrands(token),
                getCashbackTransactions(token),
                getWithdrawalRequests(token),
                getUserProfile(token),
                getPaymentMethods(token),
            ]);

            setDashboardData({
                financials,
                referral,
                favorites: favorites || [],
                recentTransactions: transactions || [],
                withdrawalRequests: withdrawals || [],
                profile,
                paymentMethods: paymentMethods || [],
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [session, status]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return { data: dashboardData, loading, error, mutate: fetchAllData };
}
