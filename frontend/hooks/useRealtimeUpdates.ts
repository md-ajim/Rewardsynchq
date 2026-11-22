import { useQueryClient } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';

import { Transaction as CashbackTransaction } from './use-cashback';

export const useRealtimeUpdates = (pendingTransactions: CashbackTransaction[]) => {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/cashback/');
        
        ws.current.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'TRANSACTION_UPDATE') {
            // Invalidate and refetch cashback data
            queryClient.invalidateQueries({ queryKey: ['cashback'] });
          }
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
          // Attempt reconnect after delay
          setTimeout(connectWebSocket, 5000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [queryClient]);

  // Polling fallback for pending transactions
  useEffect(() => {
    if (pendingTransactions.length === 0) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['cashback'] });
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [pendingTransactions.length, queryClient]);
};