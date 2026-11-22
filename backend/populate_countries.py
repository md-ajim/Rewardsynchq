import os
import django
import urllib.request
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.settings')
django.setup()

from dealvers.core_models import Country

def get_flag_emoji(country_code):
    return "".join(chr(ord(c) + 127397) for c in country_code.upper())

def populate():
    url = "https://flagcdn.com/en/codes.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    countries_to_create = []
    existing_codes = set(Country.objects.values_list('code', flat=True))
    
    for code, name in data.items():
        # flagcdn codes include some regions, we generally only want the standard 2-letter iso codes
        if len(code) == 2:
            code_upper = code.upper()
            if code_upper not in existing_codes:
                countries_to_create.append(
                    Country(
                        name=name,
                        code=code_upper,
                        flag_emoji=get_flag_emoji(code_upper)
                    )
                )
    
    if countries_to_create:
        Country.objects.bulk_create(countries_to_create, ignore_conflicts=True)
        print(f"Successfully added {len(countries_to_create)} countries.")
    else:
        print("No new countries to add.")

if __name__ == "__main__":
    populate()
