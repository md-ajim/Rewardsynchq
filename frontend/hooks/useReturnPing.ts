'use client';
import { apiBaseUrl } from '@/lib/api-base'

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function useReturnPing() {
  const { data: session } = useSession();
  const pingedRef = useRef(false);

  useEffect(() => {
    // Only run if we have a session and haven't pinged yet
    if (!session?.accessToken || pingedRef.current) return;

    // Read the rshq_click_id cookie
    const clickId = document.cookie
      .split('; ')
      .find(row => row.startsWith('rshq_click_id='))
      ?.split('=')[1];

    if (clickId) {
      pingedRef.current = true;
      
      const pingBackend = async () => {
        try {
          const API_BASE_URL = apiBaseUrl();
          await fetch(`${API_BASE_URL}/session/return-ping/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ click_id: clickId }),
          });
        } catch (error) {
          console.error('[RSHQ] Failed to send return ping:', error);
        }
      };
      
      pingBackend();
    }
  }, [session]);
}
