'use client';

import { Deal } from '@/types/deal';
import { trackEvent } from '@/lib/analytics';

import { useState, useEffect } from 'react';

import { toast } from 'sonner';

export function useDealInteractions(deal: Deal) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if deal is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('rewardsynchq_wishlist') || '[]');
    setIsInWishlist(wishlist.includes(deal.id));
  }, [deal.id]);

  const handleAffiliateClick = () => {
    trackEvent('affiliate_click', {
      deal_id: deal.id,
      affiliate_url: deal.affiliate_link,
    });
    
    // Open affiliate link in new tab
    window.open(`/api/outgoing/redirect?deal_id=${deal.id}`, '_blank', 'noopener,noreferrer');
    
    toast.success('Redirecting to merchant...');
  };

  const handleCouponCopy = () => {
    if (deal.coupon) {
      navigator.clipboard.writeText(deal.coupon);
      trackEvent('coupon_copy', { deal_id: deal.id });
      toast.success('Coupon code copied to clipboard!');
    }
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('rewardsynchq_wishlist') || '[]');
    let newWishlist;

    if (isInWishlist) {
      newWishlist = wishlist.filter((id: number) => id !== deal.id);
      toast.info('Removed from wishlist');
    } else {
      newWishlist = [...wishlist, deal.id];
      toast.success('Added to wishlist!');
    }

    localStorage.setItem('rewardsynchq_wishlist', JSON.stringify(newWishlist));
    setIsInWishlist(!isInWishlist);
    
    trackEvent('wishlist_toggle', {
      deal_id: deal.id,
      status: !isInWishlist ? 'added' : 'removed',
    });
  };

  return {
    handleAffiliateClick,
    handleCouponCopy,
    handleWishlistToggle,
    isInWishlist,
  };
}