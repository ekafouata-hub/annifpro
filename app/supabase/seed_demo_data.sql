insert into public.members (
  full_name,
  phone,
  category,
  birth_date,
  marriage_date,
  is_active
)
select
  seed.full_name,
  seed.phone,
  seed.category,
  seed.birth_date,
  seed.marriage_date,
  seed.is_active
from (values
  ('DEMO - Afi Soglo', '+229 00 00 00 01', 'Filleule', '1990-11-07'::date, null::date, true),
  ('DEMO - Yao Koffi', '+229 00 00 00 02', 'Filleul', '1985-11-09'::date, null::date, true),
  ('DEMO - Couple Agossou', '+229 00 00 00 03', 'Couple', null::date, '2012-11-10'::date, true),
  ('DEMO - Mireille Tossa', '+229 00 00 00 04', 'Filleule', '1998-12-01'::date, '2021-05-06'::date, true),
  ('DEMO - Pascal Hounkpe', '+229 00 00 00 05', 'Filleul', '1979-01-17'::date, null::date, true),
  ('DEMO - Couple Assogba', '+229 00 00 00 06', 'Couple', null::date, '2008-02-14'::date, true),
  ('DEMO - Clarisse Adjovi', '+229 00 00 00 07', 'Filleule', '2001-03-08'::date, null::date, true),
  ('DEMO - Rodrigue Houngbo', '+229 00 00 00 08', 'Filleul', '1987-06-22'::date, '2015-09-12'::date, true),
  ('DEMO - Couple Dossou', '+229 00 00 00 09', 'Couple', null::date, '1999-08-03'::date, true),
  ('DEMO - Bernard Ahouandjinou', '+229 00 00 00 10', 'Filleul', '1968-10-25'::date, null::date, false)
) as seed(full_name, phone, category, birth_date, marriage_date, is_active)
where not exists (
  select 1
  from public.members member
  where member.full_name = seed.full_name
);

insert into public.message_templates (type, title, content, is_default)
select seed.type, seed.title, seed.content, seed.is_default
from (values
  ('birth', 'DEMO - Vœux d’anniversaire', 'Joyeux anniversaire {prenom} ! Toute l’association te souhaite une année remplie de joie, de santé et de belles réussites. Nous célébrons cette journée avec toi.', true),
  ('marriage', 'DEMO - Vœux de mariage', 'Joyeux anniversaire de mariage {prenoms} ! Que votre union continue de grandir dans la joie, la complicité et l’amour. Avec toute notre affection.', true)
) as seed(type, title, content, is_default)
where not exists (
  select 1
  from public.message_templates template
  where template.type = seed.type and template.title = seed.title
);