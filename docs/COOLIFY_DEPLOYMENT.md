# Coolify deployment (self-hosted Docker)

This repository ships a complete Docker Compose stack for Coolify:

| Service      | Image / build        | Internal port | Public host                 |
| ------------ | -------------------- | ------------- | --------------------------- |
| `frontend`   | `frontend/Dockerfile`| 3000          | `app.rewardsynchq.com`      |
| `backend`    | `backend/Dockerfile` | 8000          | `api.rewardsynchq.com`      |
| `celery`     | `backend/Dockerfile` | —             | —                           |
| `celery-beat`| `backend/Dockerfile` | —             | —                           |
| `db`         | `postgres:15-alpine` | 5432          | internal only               |
| `redis`      | `redis:7-alpine`     | 6379          | internal only               |

Coolify project: **DealVerse** · application: **dealverse**
(`winhlmor62xmiukf338mkpva`) · server: `localhost`.

Coolify dashboard: <http://192.168.0.102:8000>

---

## 1. DNS and network

The public IP of the host is **103.108.63.236**. The `rewardsynchq.com`
hosted zone is on AWS Route 53, so add these records there:

| Type | Name                  | Value              | TTL |
| ---- | --------------------- | ------------------ | --- |
| A    | `app.rewardsynchq.com`| `103.108.63.236`   | 300 |
| A    | `api.rewardsynchq.com`| `103.108.63.236`   | 300 |

Also forward TCP **80** and **443** (and UDP 443 if you want HTTP/3) on the
router to `192.168.0.102`. The apex and `www` records currently point at
CloudFront and are not touched by this deployment.

Traefik requests Let's Encrypt certificates automatically. Until the records
exist and the ports are reachable, it serves its default self-signed
certificate and public HTTPS will show a certificate warning.

Verify once DNS has propagated:

```bash
dig +short app.rewardsynchq.com
dig +short api.rewardsynchq.com
curl -I https://app.rewardsynchq.com
curl -s https://api.rewardsynchq.com/health/
```

## 2. How a deployment runs

1. Push to `main` on `git@github.com:md-ajim/DealVerse.git`.
2. In Coolify open **DealVerse → dealverse → Deploy**, or call the API:

   ```bash
   curl -X POST "http://localhost:8000/api/v1/deploy?uuid=winhlmor62xmiukf338mkpva" \
     -H "Authorization: Bearer $COOLIFY_TOKEN"
   ```

Coolify clones the repo with the read-only deploy key
`Coolify DealVerse deploy`, runs `docker compose build`, then replaces the
containers. Database and media volumes persist across deployments.

Auto-deploy on push is disabled. Enable it in Coolify (**Webhooks**) if you
want GitHub pushes to deploy automatically.

### Environment variables

They are managed in Coolify, not committed. Required keys:

- Django: `DEBUG`, `SECRET_KEY` (generated), `ALLOWED_HOSTS`,
  `CSRF_TRUSTED_ORIGINS`, `CORS_ALLOWED_ORIGINS`,
  `CORS_ALLOW_ALL_ORIGINS`, `SECURE_SSL_REDIRECT`, `SERVE_MEDIA`
- Database: `POSTGRES_DB`, `POSTGRES_USER`, `SERVICE_PASSWORD_POSTGRES`
- Frontend: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_URL`,
  `NEXTAUTH_URL`, `INTERNAL_API_BASE_URL`, `SERVICE_BASE64_64_NEXTAUTHSECRET`
- Integrations: `MAILTRAP_API_TOKEN`, `IMPACT_API_TOKEN`,
  `IMPACT_ACCOUNT_SID`, `AFFILIATE_WEBHOOK_SECRET`, `GEMINI_API_KEY`,
  `DEEPSEEK_API_KEY`

`AFFILIATE_WEBHOOK_SECRET` is **required** when `DEBUG=False`: the backend
refuses to start if it is empty or set to a known default value. Generate a
long random string and configure the same value on the affiliate network.

`NEXT_PUBLIC_*` values are baked into the client bundle at build time, so
changing one requires a redeploy.

`INTERNAL_API_BASE_URL` is used by Next.js server components and route
handlers to call `http://backend:8000/server` directly. Browser requests use
the public `https://api.rewardsynchq.com/server`.

## 3. Admin user

The new Postgres database starts empty. Create the first admin:

```bash
docker exec -it $(docker ps --format '{{.Names}}' | grep '^backend-winhlmor' | head -1) \
  python manage.py createsuperuser
```

Admin UI: <https://api.rewardsynchq.com/admin/>

## 4. Existing production data (optional)

The previous production database is the Neon Postgres instance configured in
`backend/.env`. To copy it into the new stack:

```bash
# 1. Dump from Neon (run from a machine with pg_dump 15+)
pg_dump "$SOURCE_DATABASE_URL" --no-owner --no-acl -Fc -f /tmp/dealverse.dump

# 2. Restore into the Coolify-managed Postgres
DB=$(docker ps --format '{{.Names}}' | grep '^db-winhlmor' | head -1)
docker cp /tmp/dealverse.dump "$DB":/tmp/dealverse.dump
docker exec "$DB" pg_restore -U dealverse -d dealverse --clean --if-exists --no-owner /tmp/dealverse.dump

# 3. Restart the app processes
docker restart $(docker ps --format '{{.Names}}' | grep -E '^(backend|celery|celery-beat)-winhlmor' | tr '\n' ' ')
```

Do this during a maintenance window. `pg_restore --clean` replaces the empty
schema; it does not touch the media volume.

Media files are stored in the `media_data` volume. Copy the old media
directory into it if the current site has uploads that are not in the repo.

## 5. Backups

Configure **Scheduled Backups** for the Postgres resource in Coolify
(Databases → dealverse db → Backups), or run:

```bash
DB=$(docker ps --format '{{.Names}}' | grep '^db-winhlmor' | head -1)
docker exec "$DB" pg_dump -U dealverse -d dealverse -Fc > /backup/dealverse-$(date +%F).dump
```

Back up the `media_data` volume separately (restic, rsync, or a volume
backup tool).

## 6. Operations

```bash
# Container status
docker ps --format 'table {{.Names}}\t{{.Status}}' | grep winhlmor

# Logs
docker logs -f $(docker ps --format '{{.Names}}' | grep '^backend-winhlmor' | head -1)
docker logs -f $(docker ps --format '{{.Names}}' | grep '^frontend-winhlmor' | head -1)

# Django shell
docker exec -it $(docker ps --format '{{.Names}}' | grep '^backend-winhlmor' | head -1) python manage.py shell

# Apply migrations manually (normally done on container start)
docker exec $(docker ps --format '{{.Names}}' | grep '^backend-winhlmor' | head -1) python manage.py migrate --noinput
```

## 7. Local verification

The same stack can be run without Coolify:

```bash
docker compose --env-file .env.production up -d --build
```

For local use, set `ALLOWED_HOSTS=localhost,127.0.0.1`, `SECURE_SSL_REDIRECT=False`,
and publish ports with a compose override.

## 8. Security checklist

- Change the Coolify admin password and enable 2FA.
- Revoke unused API tokens (**Keys & Tokens**). The token
  `dealverse-deploy` was created for automation.
- Keep Coolify and the host patched; Coolify auto-update is enabled.
- Do not commit `.env` files or secrets.
- Restrict SSH and the Coolify dashboard to trusted networks/VPN.
