-- =============================================================
-- YA EJECUTADO — NO HACE FALTA VOLVER A CORRERLO.
-- El usuario admin se creó el 2026-06-13 mediante la Auth Admin API
-- (método preferido: crea también el registro en auth.identities)
-- y se le asignó el rol 'admin' en public.user_roles.
--
-- Se deja este archivo solo como referencia / recuperación.
-- =============================================================

-- Listar los usuarios con rol admin:
SELECT u.email, r.role, u.created_at
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE r.role = 'admin';

-- Para dar rol admin a un usuario existente (ejecutar con service role / SQL editor):
-- INSERT INTO public.user_roles (user_id, role) VALUES ('<uuid-del-usuario>', 'admin');

-- Para CAMBIAR la contraseña en el futuro, hazlo desde:
--   Supabase Dashboard > Authentication > Users > (usuario) > Reset password
-- o con la Auth Admin API. No edites auth.users directamente.
