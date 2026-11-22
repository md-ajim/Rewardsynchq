import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.settings")
django.setup()

from dealvers.core_models import Category
from dealvers.brand_deals_models import Brand

dating_categories = Category.objects.filter(name__icontains='dating')
print(f"Found {dating_categories.count()} dating categories to delete.")

for cat in dating_categories:
    print(f"Deleting category: {cat.name}")
    # Also delete brands that belong ONLY to this category or have 'dating' in their name
    brands = Brand.objects.filter(categories=cat)
    for b in brands:
        print(f"Deleting brand associated with dating: {b.name}")
        b.delete()
    cat.delete()
    
# Also delete any brand with dating in the name
dating_brands = Brand.objects.filter(name__icontains='dating')
for b in dating_brands:
    print(f"Deleting dating brand: {b.name}")
    b.delete()

print("Dating removal complete.")
