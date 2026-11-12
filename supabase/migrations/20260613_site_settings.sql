-- Tabla de configuración del sitio (email destino, WhatsApp, etc.)
create table if not exists public.site_settings (
  key   text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Cualquiera puede leer (el número de WhatsApp es público)
create policy "Public read site_settings"
  on public.site_settings for select
  using (true);

-- Solo admins pueden modificar
create policy "Admin insert site_settings"
  on public.site_settings for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admin update site_settings"
  on public.site_settings for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admin delete site_settings"
  on public.site_settings for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Valores por defecto
insert into public.site_settings (key, value) values
  ('contact_email',    'info@proyectosmrr.es'),
  ('whatsapp_number',  '+34711253361'),
  ('whatsapp_message', 'Hola, me gustaría obtener más información sobre vuestros servicios.')
on conflict (key) do nothing;
