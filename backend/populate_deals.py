import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.settings")
django.setup()

from django.db.models.signals import post_save, pre_save, m2m_changed
# Clear all signals to prevent slow sitemap pings / external API calls
post_save.receivers.clear()
pre_save.receivers.clear()
m2m_changed.receivers.clear()

from dealvers.deal_data_models import Deal
from dealvers.product_models import Product, DigitalAsset

def populate_deals():
    print("Clearing existing deals...")
    # Keep the Namecheap deal (ID 1) if it exists
    Deal.objects.exclude(id=1).delete()

    print("Loading Products...")
    products = Product.objects.all()
    created_from_products = 0
    for p in products:
        # Calculate discount percentage if original_price exists
        discount_display = None
        if p.original_price and p.price and p.original_price > p.price:
            diff = p.original_price - p.price
            pct = int(round((diff / p.original_price) * 100))
            if pct > 0:
                discount_display = f"{pct}% OFF"

        deal = Deal.objects.create(
            title=p.name,
            description=p.description or "",
            image=p.main_image,
            brand=p.brand,
            cashback_percentage=p.cashback_percentage,
            price=p.price,
            coupon_code=p.coupon_code,
            affiliate_url=p.affiliate_url or (p.brand.affiliate_link if p.brand else ""),
            category=p.category,
            is_trending=p.is_trending,
            discount_display=discount_display,
            created_at=p.created_at
        )
        # Copy countries
        deal.countries.set(p.countries.all())
        created_from_products += 1

    print("Loading Digital Assets...")
    assets = DigitalAsset.objects.all()
    created_from_assets = 0
    for a in assets:
        discount_display = None
        if a.previous_price and a.price and a.previous_price > a.price:
            diff = a.previous_price - a.price
            pct = int(round((diff / a.previous_price) * 100))
            if pct > 0:
                discount_display = f"{pct}% OFF"

        deal = Deal.objects.create(
            title=a.name,
            description=a.description or "",
            image=a.main_image,
            brand=a.brand,
            cashback_percentage=a.cashback_percentage,
            price=a.price,
            coupon_code=a.coupon_code,
            affiliate_url=a.affiliate_url,
            category=a.category,
            is_trending=a.is_featured,
            discount_display=discount_display,
            created_at=a.created_at
        )
        # Copy countries
        deal.countries.set(a.countries.all())
        created_from_assets += 1

    print(f"Successfully populated {created_from_products} deals from Products and {created_from_assets} deals from Digital Assets.")
    print(f"Total deals in database: {Deal.objects.count()}")

if __name__ == "__main__":
    populate_deals()
