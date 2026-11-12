# AGENTS.md — Handoff para agentes de IA

> Léelo entero antes de tocar nada. Última actualización: 2026-11-12.
> Este repositorio es **público**: todo lo que se commitea queda expuesto.

## 1. Qué es

Web corporativa de **Proyectos MRR** (https://proyectosmrr.es), empresa de reformas
sostenibles e inversión inmobiliaria en Madrid. Es una SPA con:

- Páginas públicas: inicio, quiénes somos, servicios (reformas / inversión), blog, contacto, aviso legal, política de privacidad.
- Formulario de contacto → Edge Function de Supabase → email vía Resend + registro en BD.
- Panel de administración (`/admin`): gestión de clientes (leads del formulario), entradas del blog (con subida de imágenes) y ajustes del sitio (email de destino, WhatsApp).

Nació como proyecto de **Lovable** (de ahí `lovable-tagger`, los componentes shadcn y el comentario "automatically generated" en el cliente de Supabase). Hoy se mantiene en local; este repo **no está sincronizado con Lovable**.

Idioma del proyecto: **español** (código, comentarios, commits y UI). Mantén esa convención.

## 2. Stack

| Capa | Tecnología |
|---|---|
| Frontend | Vite 5 + React 18 + TypeScript (modo no estricto) |
| UI | Tailwind CSS 3 + shadcn/ui (Radix) + lucide-react |
| Routing | react-router-dom 7 con **`HashRouter`** (URLs tipo `/#/contacto`) |
| Datos | Supabase JS v2 + TanStack Query |
| Formularios | react-hook-form + zod |
| i18n | i18next (es por defecto, en) — **parcial**, ver §7 |
| Backend | Supabase: Postgres + RLS, Auth, Storage, Edge Functions (Deno) |
| Email | Resend (desde la Edge Function) |
| Analítica | Google tag `G-ZQQD83FR06` + Google Ads `AW-17273217970` (en `index.html`) |

## 3. Comandos

```sh
npm install          # usar npm (package-lock.json es la referencia; bun.lockb es legado)
npm run dev          # http://localhost:8080
npm run build        # genera dist/ — DEBE pasar antes de cualquier commit
npm run lint         # hoy: 5 errores + 19 warnings preexistentes (ver §7)
npm run preview
```

No hay tests automatizados. Verifica los cambios con `npm run build` y probando en el navegador.

Requiere un `.env` en la raíz (copia `.env.example`). Pide los valores al propietario; **nunca los inventes ni los commitees**.

## 4. Estructura

```
src/
  App.tsx                     rutas (HashRouter)
  pages/                      una página por ruta; Admin*.tsx = panel admin
  components/
    layout/                   Header, Footer (lee WhatsApp de site_settings), Layout, ScrollToTop
    admin/                    ClientsList, BlogPostsList, AdminSettings
    ui/                       shadcn/ui — no editar salvo necesidad real
    SEO.tsx                   title/meta/OG/canonical/JSON-LD por página
    ReformBudgetCalculator.tsx, BeforeAfterSlider.tsx
  hooks/useAuth.tsx           sesión + comprobación de rol admin (tabla user_roles)
  integrations/supabase/      client.ts (lee VITE_*) y types.ts (tipos generados de la BD)
  lib/ads-conversion.ts       evento de conversión de Google Ads (envío de contacto)
  i18n/                       config + locales/es.json, en.json
  data/blogPosts.ts           LEGADO: no se importa en ningún sitio; el blog vive en Supabase
supabase/
  migrations/                 esquema completo, en orden cronológico
  functions/send-contact-email/  Edge Function del formulario de contacto
  config.toml                 project_id + verify_jwt=false para la función de contacto
  create_admin_user.sql       referencia (ya ejecutado)
public/                       favicon, robots.txt, sitemap.xml, isologo.png
```

Alias de import: `@/` → `src/`.

## 5. Modelo de datos (Supabase)

| Tabla | Uso | Acceso (RLS) |
|---|---|---|
| `blog_posts` | entradas del blog (`slug`, `title`, `excerpt`, `content` en Markdown, `cover_image`, `categories[]`, `published`, `published_at`) | público lee solo `published = true`; admin CRUD |
| `clients` | leads del formulario de contacto | solo admin lee/edita; inserta la Edge Function con service role |
| `contact_rate_limits` | rate limit por IP del formulario (5/hora) | solo service role / admin |
| `user_roles` | `(user_id, role app_role)` | admin gestiona; función `has_role(uid, role)` |
| `site_settings` | clave/valor: `contact_email`, `whatsapp_number`, `whatsapp_message`, `whatsapp_enabled` | lectura pública; escritura solo admin |

Storage: bucket público `blog-images` (subida/borrado solo admin).

**Admin**: es un usuario de Supabase Auth con fila `role = 'admin'` en `user_roles`. No hay registro público en la UI (aunque `useAuth` expone `signUp`, ninguna página lo usa).

**Cambios de esquema**: crea siempre una migración nueva en `supabase/migrations/` (`YYYYMMDD_descripcion.sql`), con RLS activado y políticas explícitas. Después regenera `src/integrations/supabase/types.ts`. No edites migraciones ya aplicadas.

## 6. Seguridad — reglas no negociables

1. **Nunca** commitees `.env`, claves `service_role`, contraseñas de BD, tokens `sbp_…` ni la API key de Resend. El `.gitignore` ya excluye `.env*`.
2. Solo las variables `VITE_*` llegan al navegador y son públicas por diseño (URL + publishable/anon key). Cualquier otra credencial **jamás** con prefijo `VITE_`.
3. Toda tabla nueva: `ENABLE ROW LEVEL SECURITY` + políticas mínimas. El frontend usa la anon key, así que la RLS es la única barrera.
4. Secretos de la Edge Function (`RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) se configuran en Supabase (Dashboard → Edge Functions → Secrets), no en el repo.
5. Excluidos a propósito y que no deben añadirse: `supabase/.temp/`, `.claude/settings.local.json`, documentos internos (`*.odp`, `temp_odp/`, `temp_presentation.zip`).
6. Antes de hacer push, revisa el diff en busca de secretos (`git diff --cached | grep -iE "key|token|password|secret"`).

## 7. Estado actual y problemas conocidos

- **Build**: OK. Bundle principal ~1,26 MB (warning de chunk > 500 kB). Mejora pendiente: `React.lazy` en las rutas `/admin*` y en páginas pesadas.
- **Lint**: 5 errores preexistentes — interfaces vacías en `ui/command.tsx` y `ui/textarea.tsx`, `any` en la Edge Function, `require()` en `tailwind.config.ts`. No bloquean el build.
- **`tsc --noEmit`** falla por `"ignoreDeprecations": "6.0"` en `tsconfig.app.json` (valor no válido para TS 5.x). Vite no hace type-check, por eso el build pasa.
- **HashRouter vs SEO**: las rutas reales son `/#/ruta`, pero `sitemap.xml`, los canonical de `SEO.tsx` y `robots.txt` usan `/ruta` sin hash. Si el hosting no reescribe a `index.html`, esas URLs devuelven 404 a los buscadores. Migrar a `BrowserRouter` requiere configurar el fallback SPA en el hosting: confirma con el propietario dónde está desplegado antes de cambiarlo.
- **i18n parcial**: solo `Header`, `Footer`, `LanguageSelector` e `Index` usan traducciones. El resto de páginas tiene el texto en español incrustado.
- **Sitemap**: `lastmod` fijo en 2026-01-08 y no incluye las entradas del blog (que son dinámicas).
- **Hosting/deploy**: no documentado en el repo. El sitio es estático (`dist/`) + Supabase. Pregunta al propietario antes de asumir proveedor o desplegar.
- `src/data/blogPosts.ts` y `bun.lockb` son restos sin uso; se pueden borrar si se confirma.
- Supabase Auth: conviene confirmar que el registro público de usuarios está desactivado en el dashboard (no da privilegios, pero no hace falta).

## 8. Cómo trabajar en este repo

- Rama por defecto: `main`. Para cambios no triviales, crea una rama y abre PR.
- Commits en español, en imperativo y descriptivos (`Añade…`, `Corrige…`).
- No reescribas el historial de `main` (`push --force` prohibido).
- No toques `src/components/ui/*` salvo que sea imprescindible: es código generado por shadcn.
- Textos de cara al cliente: tono profesional, cercano y en español de España.
- Cambios en `index.html` (gtag, JSON-LD, meta): son críticos para SEO y para la medición de Google Ads; no los elimines sin confirmarlo.
- Si un cambio requiere acceso a Supabase (migraciones, secretos, desplegar la función), **no lo ejecutes contra producción sin confirmación explícita del propietario**. Deja el SQL o los comandos preparados.

Despliegue de la Edge Function (con acceso concedido):

```sh
supabase functions deploy send-contact-email --project-ref <project-ref>
```

## 9. Al terminar tu sesión

Actualiza este archivo si cambias la arquitectura, el esquema, los comandos o resuelves alguno de los problemas de §7. El siguiente agente depende de que esté al día.
