# Anniv-Reminder

Plateforme de gestion et de rappel des anniversaires pour l’Association ISAAC ET REBECCA.

## Objectif

Automatiser les rappels d’anniversaires de naissance et de mariage, préparer les messages de vœux et faciliter l’envoi dans WhatsApp.

## Architecture actuelle

- Application : Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS
- Backend et base de données : Supabase (PostgreSQL)
- Authentification : Supabase Auth avec sessions sécurisées par cookies
- Autorisations : politiques Row Level Security (RLS)
- Déploiement cible : Vercel

L’ancien prototype Express + Vite est conservé dans `apps/` comme référence de migration. L’application cible est dans `app/`.

```text
annif_pro/
├── app/
│   ├── src/
│   ├── supabase/migrations/
│   ├── .env.example
│   └── package.json
├── apps/                 # prototype Express + Vite
├── docs/
├── .gitignore
├── README.md
├── PROJECT_PROCESS.md
└── package.json
```

## Démarrage rapide

1. Suivre les étapes de configuration dans [`app/README.md`](./app/README.md).
2. Configurer le projet Supabase et appliquer la migration SQL.
3. Démarrer Next.js depuis le dossier `app/`.

## Prochaines étapes

- Migrer le CRUD des membres vers Supabase
- Migrer le tableau de bord et le calendrier vers les données réelles
- Créer le moteur de rappel journalier
- Construire la génération de messages et d’images
- Créer les notifications

## Documentation

- `PROJECT_PROCESS.md` : plan complet de mise en place
- `docs/` : documents de conception et d’architecture à compléter
