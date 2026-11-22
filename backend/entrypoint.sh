#!/bin/sh
set -e

wait_for_database() {
    python - <<'PY'
import os
import sys
import time

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.settings')
django.setup()

from django.db import connections
from django.db.utils import OperationalError

for attempt in range(1, 31):
    try:
        connections['default'].ensure_connection()
        print('Database connection ready.')
        sys.exit(0)
    except OperationalError as exc:
        print(f'Waiting for database ({attempt}/30): {exc}')
        time.sleep(2)

print('Database did not become ready in time.', file=sys.stderr)
sys.exit(1)
PY
}

case "$1" in
    web)
        wait_for_database
        python manage.py migrate --noinput
        python manage.py collectstatic --noinput
        exec gunicorn settings.wsgi:application \
            --bind "0.0.0.0:${PORT:-8000}" \
            --workers "${WEB_CONCURRENCY:-3}" \
            --threads "${WEB_THREADS:-2}" \
            --timeout "${WEB_TIMEOUT:-120}" \
            --access-logfile - \
            --error-logfile -
        ;;
    celery-worker)
        shift
        exec celery -A settings worker \
            --loglevel "${CELERY_LOG_LEVEL:-info}" \
            --concurrency "${CELERY_CONCURRENCY:-2}" \
            "$@"
        ;;
    celery-beat)
        shift
        exec celery -A settings beat --loglevel "${CELERY_LOG_LEVEL:-info}" "$@"
        ;;
    *)
        exec "$@"
        ;;
esac
