-- Permite mostrar/ocultar el contacto por WhatsApp desde el panel admin.
insert into public.site_settings (key, value) values
  ('whatsapp_enabled', 'true')
on conflict (key) do nothing;
