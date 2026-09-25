# Deploy en Vercel

## 1. Base de datos (PostgreSQL)
En el proyecto de Vercel: **Storage → Create → Neon (Postgres)** y conéctalo al proyecto.
Copia la cadena `DATABASE_URL` (pooled). El `build` ejecuta `prisma migrate deploy`, así que las tablas se crean solas en el primer deploy.

## 2. Importar el repo
**Vercel → Add New → Project → Import `nandoedwin2213/venice-payphone-saas`.**
Framework: Next.js (auto). Vercel usa pnpm 8 por `packageManager` en `package.json`.

## 3. Variables de entorno (Settings → Environment Variables)

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://<tu-proyecto>.vercel.app` |
| `NEXTAUTH_URL` | `https://<tu-proyecto>.vercel.app` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | del paso 1 |
| `PAYPHONE_AUTH_TOKEN` | token de la app en appdeveloper.payphonetodoesposible.com |
| `PAYPHONE_STORE_ID` | opcional (déjala vacía o no la crees) |
| `VENICE_API_KEY` | venice.ai/settings/api |
| `VENICE_MODEL` | `llama-3.3-70b` (opcional) |
| `VENICE_IMAGE_MODEL` | `lustify-sdxl` (opcional) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth App de GitHub (login) |
| `GITHUB_ACCESS_TOKEN` | PAT con permisos de lectura (contador de estrellas del repo en la home; cualquier PAT sirve) |
| `SMTP_FROM` | `login@<tu-dominio>` |
| `POSTMARK_API_TOKEN` | Postmark (login por email). Si no lo usas aún, pon cualquier valor no vacío |
| `POSTMARK_SIGN_IN_TEMPLATE` / `POSTMARK_ACTIVATION_TEMPLATE` | IDs de plantilla Postmark (o valor no vacío) |

## 4. GitHub OAuth (login)
GitHub → Settings → Developer settings → OAuth Apps → New:
- Homepage URL: `https://<tu-proyecto>.vercel.app`
- Callback URL: `https://<tu-proyecto>.vercel.app/api/auth/callback/github`

## 5. PayPhone
En la app de PayPhone añade el dominio `https://<tu-proyecto>.vercel.app` como dominio autorizado
(la URL de retorno que envía la app es `/payphone/response`). Para pagos reales cambia la app a **Producción**.

## Local
```bash
docker compose up -d
cp .env.example .env   # rellena las keys
npx pnpm@8 install
npx prisma migrate deploy
pnpm dev
```
