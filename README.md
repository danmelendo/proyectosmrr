# Proyectos MRR — Web corporativa

Web de [Proyectos MRR](https://proyectosmrr.es), especialistas en reformas sostenibles e inversión inmobiliaria en Madrid.

SPA en **React + Vite + TypeScript + Tailwind/shadcn** con backend en **Supabase** (Postgres con RLS, Auth, Storage y Edge Functions). Incluye blog, formulario de contacto con envío de email (Resend) y panel de administración.

## Puesta en marcha

```sh
npm install
cp .env.example .env   # rellena las variables de Supabase
npm run dev            # http://localhost:8080
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | ESLint |

## Estructura

- `src/pages/` — una página por ruta (incluido el panel `/admin`)
- `src/components/` — layout, panel admin y componentes shadcn/ui
- `src/integrations/supabase/` — cliente y tipos de la base de datos
- `supabase/migrations/` — esquema SQL y políticas RLS
- `supabase/functions/send-contact-email/` — Edge Function del formulario de contacto

## Para agentes de IA

Lee [AGENTS.md](AGENTS.md) antes de empezar: contexto, arquitectura, reglas de seguridad y problemas conocidos.

## Seguridad

No subas nunca archivos `.env` ni claves privadas. Si encuentras una vulnerabilidad, contacta con el equipo por el formulario de [proyectosmrr.es](https://proyectosmrr.es/#/contacto) en lugar de abrir un issue público.
