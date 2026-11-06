# Anniv-Reminder — application Next.js

Application web Next.js 16 pour l’Association ISAAC ET REBECCA.

## Prérequis

- Node.js 20.9 ou supérieur
- Un projet Supabase

## Configuration Supabase

1. Copiez `.env.example` vers `.env.local`.
2. Renseignez l’URL du projet et sa clé `anon` publique dans `.env.local`.
   N’utilisez jamais la clé `service_role` dans le navigateur ou dans ce fichier.
3. Appliquez `supabase/migrations/20261105190000_initial_schema.sql` depuis le SQL Editor Supabase ou avec la CLI Supabase.
4. Créez les utilisateurs depuis le tableau de bord Supabase (l’inscription publique n’est pas activée).
   Le rôle initial est `bureau`. Pour désigner le premier administrateur, connectez-vous au SQL Editor et exécutez, en remplaçant l’adresse :

   ```sql
   update public.profiles
   set role = 'super_admin'
   where id = (
     select id from auth.users
     where email = 'admin@exemple.com'
   );
   ```

5. Lancez l’application :

   ```bash
   npm install
   npm run dev
   ```

L’application est ensuite disponible sur `http://localhost:3000`. Les pages sont protégées par la session Supabase. Les politiques RLS autorisent la consultation aux utilisateurs authentifiés et réservent les modifications aux super administrateurs.

## Scripts

- `npm run dev` : serveur local
- `npm run build` : build de production
- `npm run start` : serveur de production
- `npm run lint` : vérification ESLint

## État

- Socle Next.js 16 et Tailwind CSS
- Session Supabase, connexion et déconnexion
- Schéma initial et politiques RLS sous `supabase/migrations`
- Proxy de session Next.js 16 et ESLint 9
- Les écrans membres, calendrier et données réelles du tableau de bord restent à migrer
