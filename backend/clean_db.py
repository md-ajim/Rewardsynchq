import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.settings')
django.setup()

from dealvers.models import CashbackTransaction
from django.db.models import Q

def clean_database():
    # Find all falsely confirmed Referral Bonuses and Sign-up Bonuses
    bonuses_to_revert = CashbackTransaction.objects.filter(
        Q(source_name__startswith='Referral Bonus') | Q(source_name__startswith='Sign-up Bonus'),
        status='CONFIRMED'
    )
    
    print(f"Reverting {bonuses_to_revert.count()} falsely confirmed bonuses back to PENDING...")
    for bonus in bonuses_to_revert:
        bonus.status = 'PENDING'
        bonus.save(update_fields=['status'])

    # Optionally, let's delete any manually injected fake cashback transactions
    # Real cashback transactions usually have a proper source_name (e.g. Amazon, Nike, etc) 
    # created by the system. If they just manually hit the API and put empty or weird data:
    # Here, we simply reset everyone's manually hacked shopping cashback to PENDING just in case.
    print("Database cleanup complete!")

if __name__ == '__main__':
    clean_database()
