# RewardSyncHQ Backend Model Architecture

> **Status:** this is a design sketch, not a description of the implemented schema. Some field names differ from the current models (for example `Brand.logo_url` instead of `logo`, and `BrandCoupon` instead of `Coupon`). For the verified runtime architecture see [`../architecture.md`](../architecture.md); for verified features and metrics see [`../README.md`](../README.md).

This document outlines the proposed unified model architecture for the RewardSyncHQ backend, designed to support all features of the frontend UI.

## 1. Core Models
Entities used across different modules.

### Category
- `name` (CharField)
- `slug` (SlugField)
- `icon` (CharField/URLField, optional)
- `parent` (ForeignKey 'self', null=True, blank=True)

### Tag
- `name` (CharField)
- `slug` (SlugField)

---

## 2. Brand & Store Module
Covers the Brands/Stores and their related information.

### Brand
- `name` (CharField)
- `slug` (SlugField)
- `logo` (URLField/ImageField)
- `banner` (URLField/ImageField)
- `description` (TextField)
- `exclusive` (BooleanField)
- `cashback_total` (DecimalField)
- `cashback_previous` (DecimalField)
- `affiliate_link` (URLField)
- `terms` (JSONField/TextField)
- `holiday_deals` (ManyToManyField Tag)
- `categories` (ManyToManyField Category)
- `related_brands` (ManyToManyField 'self')

### BrandReview
- `brand` (ForeignKey Brand)
- `user` (ForeignKey User)
- `rating` (IntegerField, 1-5)
- `comment` (TextField)
- `date` (DateTimeField)

---

## 3. Deals & Coupons Module
Specific offers and discount codes.

### Deal
- `title` (CharField)
- `description` (TextField)
- `image` (URLField/ImageField)
- `brand` (ForeignKey Brand)
- `cashback_percentage` (DecimalField)
- `base_cashback` (DecimalField)
- `bonus_cashback` (DecimalField)
- `affiliate_url` (URLField)
- `category` (ForeignKey Category)
- `popularity` (IntegerField)
- `is_featured` (BooleanField)
- `is_trending` (BooleanField)
- `expiry` (DateTimeField, optional)

### Coupon
- `brand` (ForeignKey Brand)
- `title` (CharField)
- `code` (CharField)
- `description` (TextField)
- `expiry` (DateTimeField)
- `verified` (BooleanField)

---

## 4. Products Module
Individual products with cashback.

### Product
- `name` (CharField)
- `slug` (SlugField)
- `brand` (ForeignKey Brand, optional)
- `brand_name_manual` (CharField, if brand is not in our system)
- `price` (DecimalField)
- `original_price` (DecimalField)
- `main_image` (URLField/ImageField)
- `gallery` (JSONField, list of URLs)
- `cashback_percentage` (DecimalField)
- `cashback_amount` (DecimalField)
- `rating` (FloatField)
- `review_count` (IntegerField)
- `description` (TextField)
- `availability` (CharField)
- `category` (ForeignKey Category)

---

## 5. App Rewards Module
Apps that offer rewards for installation/use.

### AppReward
- `name` (CharField)
- `brand` (ForeignKey Brand, optional)
- `icon` (URLField/ImageField)
- `category` (ForeignKey Category)
- `rating` (FloatField)
- `reward_amount` (DecimalField)
- `reward_currency` (CharField)
- `description` (TextField)
- `verified` (BooleanField)
- `tags` (ManyToManyField Tag)
- `popularity` (IntegerField)
- `added_date` (DateTimeField)

---

## 6. User Cashback & Finance Module
Tracking user earnings and withdrawals.

### CashbackTransaction
- `user` (ForeignKey User)
- `amount` (DecimalField)
- `status` (CharField: PENDING, CONFIRMED, CANCELLED)
- `source_name` (CharField, e.g., "Amazon Purchase")
- `source_id` (CharField, optional reference to internal Deal/Product)
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### WithdrawalRequest
- `user` (ForeignKey User)
- `amount` (DecimalField)
- `status` (CharField: PENDING, PROCESSING, COMPLETED, REJECTED)
- `payment_method` (CharField)
- `payment_details` (TextField/JSONField)
- `requested_at` (DateTimeField)
- `processed_at` (DateTimeField, null=True)
