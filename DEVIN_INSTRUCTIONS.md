# 🏗️ PLAN DE ARQUITECTURA PARA DEVIN: SaaS con Venice AI + PayPhone

Hola Devin, soy Antigravity. El usuario y yo hemos diseñado la arquitectura para este nuevo SaaS. Tu misión es tomar este boilerplate (shadcn-ui/taxonomy) y transformarlo en un Micro-SaaS funcional hoy mismo.

## 🎯 Objetivo Principal
Crear una herramienta SaaS impulsada por IA sin censura usando la API de **Venice.ai**, y cobrando suscripciones locales a través de **PayPhone**.

---

## 🛠️ Tareas Técnicas (Roadmap)

### 1. Inicialización y Limpieza
- [ ] Instala las dependencias (`npm install` o `pnpm install`).
- [ ] Configura el entorno local con Prisma (`npx prisma generate` y `npx prisma db push`).
- [ ] **Limpieza de Stripe:** Elimina todas las referencias a Stripe (`@stripe/stripe-js`, `/lib/stripe.ts`, endpoints webhooks de stripe). No usaremos Stripe.

### 2. Integración de Pagos (PayPhone)
- [ ] Crea una tabla o añade campos al usuario en Prisma para manejar `isPro` (Boolean).
- [ ] Crea un endpoint POST `/app/api/payphone/route.ts` que reciba el id de usuario y genere una petición a la API REST de PayPhone (v3) para crear un pago.
- [ ] Modifica la página de `Pricing` (`/app/(front)/pricing/page.tsx` o similar) para que el botón de "Suscribirse" llame a este endpoint y redirija al usuario a la pasarela de PayPhone.

### 3. Integración de IA (Venice.ai)
- [ ] Crea un archivo en `/lib/venice.ts` para configurar el cliente (puedes usar el SDK oficial de OpenAI, simplemente cambiando la `baseURL` a `https://api.venice.ai/api/v1` y usando el modelo `llama-3.1-70b` u otro modelo texto/imagen de Venice).
- [ ] Crea un Dashboard privado (ej. `/app/dashboard/generator/page.tsx`) accesible solo para usuarios autenticados.
- [ ] **Muro de pago:** Asegúrate de que este Dashboard valide si el usuario tiene `isPro == true`. Si no lo tiene, envíalo a la página de Pricing.
- [ ] Crea un endpoint `/app/api/generate/route.ts` que se comunique con la API de Venice.ai para generar el contenido sin censura (ya sea texto o imágenes).

### 🔑 Variables de Entorno Necesarias (.env)
Asegúrate de pedirle al usuario que llene estas variables en un `.env.local`:
```
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# PayPhone
PAYPHONE_AUTH_TOKEN=
PAYPHONE_STORE_ID=

# Venice AI
VENICE_API_KEY=
```

¡Éxito con la implementación! Si necesitas ayuda con la lógica o el diseño, el usuario te irá guiando.
