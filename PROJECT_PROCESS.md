# Anniv-Reminder - Processus complet de mise en place

## 1. Présentation du projet

L’Association ISAAC ET REBECCA regroupe les filleuls de mariage de l’Honorable KOUKPEMEDJI Louis. Avec l’augmentation des effectifs, la gestion des anniversaires devient complexe et sujette aux oublis. Le projet Anniv-Reminder a pour objectif de centraliser les données, d’automatiser les rappels et de faciliter la diffusion des vœux dans le groupe WhatsApp de l’association.

Cette plateforme doit améliorer la fiabilité des rappels, réduire le risque d’oubli, accélérer la préparation des manifestations et offrir une expérience simple pour les responsables.

## 2. Objectifs stratégiques

- Ne plus jamais oublier un anniversaire de naissance ou de mariage.
- Permettre aux responsables de recevoir des alertes suffisamment à l’avance.
- Automatiser la création des messages de vœux et des affiches personnalisées.
- Faciliter le partage des vœux dans le groupe WhatsApp de l’association.
- Centraliser les informations membres et les modèles de vœux.
- Assurer un accès sécurisé et une utilisation fluide sur web mobile et bureau.

## 3. Acteurs du système

### 3.1 Super Administrateur
- Gère les comptes et les autorisations.
- Ajoute, modifie et supprime les membres.
- Configure les modèles de message, les notifications et les rappels.
- Surveille les performances du système et valide les événements.

### 3.2 Responsables du Bureau
- Reçoivent les alertes par e-mail et notifications push.
- Consultent le tableau de bord des anniversaires.
- Vérifient les messages et images générés.
- Valident et partagent les vœux sur WhatsApp.

## 4. Principes de conception

### 4.1 Orientation utilité
Le produit doit être simple, rapide et sans friction. Les responsables doivent voir immédiatement :
- qui fête son anniversaire aujourd’hui,
- qui fête demain,
- quels éléments sont préparés,
- quelles actions sont encore à effectuer.

### 4.2 Automatisation intelligente
Le cœur du système repose sur une logique de détection journalière :
- vérification quotidienne des anniversaires du lendemain,
- déclenchement des notifications selon l’heure définie,
- génération automatique du message et de l’image.

### 4.3 Expérience mobile-first
Le produit doit être accessible sur téléphone, tablette et ordinateur, avec une navigation optimisée pour les responsables en mobilité.

## 5. Processus de mise en place

### Phase 1 - Analyse et cadrage

#### Objectif
Formaliser le besoin métier, les règles de fonctionnement et le périmètre fonctionnel.

#### Livrables
- cahier des charges validé,
- liste des acteurs,
- exigences fonctionnelles,
- règles de notification,
- catégories de membres,
- plan d’acceptation.

#### Tâches
1. Valider le périmètre des anniversaires à gérer : naissance et mariage.
2. Définir les champs obligatoires des membres.
3. Définir les autorisations d’accès et les rôles.
4. Définir les types de notifications.
5. Définir les règles d’édition des messages et des affiches.

### Phase 2 - Architecture technique

#### Stack recommandée
- Frontend : React + Vite + TypeScript + Tailwind CSS
- Backend : Node.js + Express.js ou NestJS
- Base de données : PostgreSQL
- Authentification : JWT + session sécurisée
- Stockage de fichiers : local ou S3 / Cloudinary
- Planification des rappels : node-cron ou système de jobs asynchrones
- Envoi d’e-mails : Nodemailer + SMTP
- Notifications push : service worker + Web Push ou solution tierce
- Génération d’images : Canvas / Sharp + templates HTML/CSS

#### Architecture logique
- Couche frontend : interface web pour admin et responsables
- Couche backend API : gestion des membres, tâches, notifications, auth
- Couche données : base PostgreSQL pour les membres, configurations, historiques
- Couche jobs : planificateur d’événements et rappel automatisé
- Couche fichiers : images, portraits, affiches exportées

#### Séparation des responsabilités
- API pour les données et workflows
- Jobs pour les événements planifiés
- Frontend pour l’interaction utilisateur
- Services d’intégration pour e-mails, média et WhatsApp

### Phase 3 - Modélisation des données

#### Entités principales
- Member
  - id
  - lastName
  - firstName
  - photoProfile
  - photoCouple
  - birthDate
  - marriageDate
  - phone
  - createdAt
  - updatedAt
  - isActive

- User
  - id
  - fullName
  - email
  - passwordHash
  - role
  - notificationPreferences

- NotificationLog
  - id
  - recipientId
  - type
  - scheduledAt
  - sentAt
  - status
  - message

- TemplateMessage
  - id
  - type (birth / marriage)
  - title
  - content
  - isDefault

- TemplatePoster
  - id
  - name
  - layoutType
  - assetPath
  - isActive

- EventReminder
  - id
  - memberId
  - reminderType
  - reminderDate
  - status

### Phase 4 - Gestion des fonctionnalités

#### 4.1 Gestion des membres
- Ajouter un membre manuellement.
- Importer depuis Excel (.xlsx, .csv).
- Rechercher par nom, prénom ou téléphone.
- Filtrer par mois de naissance ou de mariage.
- Modifier / suspendre / supprimer un membre.
- Visualiser la photo et le profil complet.

#### 4.2 Moteur de rappel intelligent
Le système exécute un job quotidien pour vérifier les anniversaires de la date suivante.

Règles de déclenchement :
- 08h00 la veille : premier rappel
- 18h00 la veille : second rappel
- 06h00 le jour J : rappel final

Le moteur doit :
- identifier les membres concernés,
- regrouper les informations complètes,
- lire les templates actifs,
- préparer le contenu généré,
- envoyer les e-mails et notifications,
- enregistrer les logs de traitement.

#### 4.3 Générateur de contenu
Le système prépare automatiquement :
- le message de vœux personnalisé,
- le message prêt à copier dans WhatsApp,
- la carte ou affiche visuelle selon un template sélectionné.

Les éléments du message doivent inclure :
- nom de l’Association,
- nom du membre ou du couple,
- age / nombre d’années de mariage selon le cas,
- formule de remerciement et de bénédiction.

Les modèles visuels :
- 3 à 4 designs disponibles,
- inclusion de la photo du profil,
- ajout d’un logo officiel,
- export au format HD.

#### 4.4 Tableau de bord
Le dashboard doit afficher :
- Aujourd’hui
- Demain
- Cette semaine
- Ce mois-ci
- calendrier mensuel avec photos
- centre de vœux pour les templates
- statut d’alerte et notification

### Phase 5 - Sécurité et conformité

#### Rôles et permissions
- Super Administrateur : accès complet
- Responsable du Bureau : accès limité aux opérations de suivi et d’envoi

#### Sécurité
- Authentification forte avec mot de passe sécurisé
- JWT ou session backend sécurisée
- Protection des routes sensibles
- Audit des actions critiques
- Validation des fichiers uploadés
- Limitation des tentatives de connexion

#### Données sensibles
- téléphone, date de naissance, photos personnelles
- protection des fichiers via stockage sécurisé
- suppression de données non nécessaires

### Phase 6 - Automatisation de tâches

#### Planification
Utiliser un scheduler robuste pour lancer quotidiennement la logique d’anniversaire.

Exemple de logique :
- scan journalier à 00h15,
- calcul des éléments du lendemain,
- envoi des alertes à 08h00 et 18h00,
- envoi final à 06h00 du jour J.

#### Bonnes pratiques
- journaux des tâches et échecs,
- mécanismes de retry,
- traitement idempotent,
- gestion de fuseau horaire,
- files d’attente pour les travaux lourds.

### Phase 7 - Intégration WhatsApp

Le bouton “Envoyer dans WhatsApp” doit :
- ouvrir le groupe WhatsApp de l’association,
- préremplir le message selon le template,
- permettre à l’utilisateur de réviser ou d’ajouter un court texte,
- permettre l’envoi final depuis l’application mobile ou desktop.

Approches possibles :
- deep link WhatsApp avec message pré-rempli,
- ouverture du groupe WhatsApp via un lien direct,
- intégration avec WhatsApp Business API si le contexte évolue.

### Phase 8 - Processus de développement

#### Sprint 1 : Fondations
- setup du projet
- auth et rôles
- base de données
- CRUD membre

#### Sprint 2 : Calendrier et notifications
- recherche / filtration
- calendrier mensuel
- moteur de rappel
- envoi e-mail

#### Sprint 3 : Contenu automatique
- templates de message
- génération de texte
- génération d’images
- export HD

#### Sprint 4 : Experience utilisateur
- dashboard
- notifications push
- intégration WhatsApp
- stabilité et tests

#### Sprint 5 : Validation et mise en production
- recette fonctionnelle
- tests de charge et scénarios
- sécurité
- déploiement web
- documentation d’exploitation

## 9. Critères de recette

### Fonctionnels
- Un membre bien saisi est visible dans le système.
- Les anniversaires du jour et du lendemain sont affichés correctement.
- Les e-mails et notifications sont envoyés aux heures prévues.
- Le message généré est correct et personnalisable.
- L’image générée contient la photo, le texte et le design attendu.
- Le bouton WhatsApp ouvre correctement le groupe avec message pré-rempli.

### Non fonctionnels
- Application rapide et réactive.
- Interface compatible mobile.
- Sécurisation des accès.
- Redondance de l’environnement web.
- Logs et traçabilité des tâches automatiques.

## 10. Plan de déploiement

### Environnements
- Développement local
- Staging / recette
- Production

### Outils
- Git pour le code
- CI/CD pour validation automatique
- environnement web contrôlé
- sauvegardes régulières de base de données

### Hébergement
- recommandé : VPS ou plateforme Cloud avec SSL, sauvegarde automatique, monitoring
- pour un lancement stable : PostgreSQL hébergé, API sécurisée, statique pour le frontend

## 11. Risques et mitigations

### Risque 1 : oublis de notification
Mitigation : logs de traitement, tests de tâches, retry automatique.

### Risque 2 : mauvaise génération des messages
Mitigation : templates validés, revue avant envoi, versioning des modèles.

### Risque 3 : fichiers lourds ou image non adaptée
Mitigation : compression, formats supportés, export HD standardisé.

### Risque 4 : sécurité
Mitigation : auth forte, validations, droits d’accès rigoureux, audit des actions.

## 12. Roadmap de mise en œuvre recommandée

### Mois 1
- cadrage + validation
- architecture + data model
- setup projet + repo

### Mois 2
- développement CRUD membre
- recherche, filtres, import Excel
- auth et dashboard

### Mois 3
- moteur de rappel / jobs / notifications
- e-mail + push
- création de templates

### Mois 4
- génération d’images + WhatsApp
- tests de recette + correction
- mise en production

## 13. Conclusion

Anniv-Reminder est une application métier à forte valeur ajoutée pour l’association. Sa puissance réside dans la combinaison de trois piliers :
- centralisation des informations,
- automatisation des alertes,
- diffusion rapide des vœux.

Une bonne mise en œuvre passera par une architecture claire, des tâches planifiées fiables, des modèles de message professionnels et un design orienté responsabilité. Cela permettra de transformer un processus manuel fragile en un système fiable, moderne et scalable.

## 14. Recommandation stratégique

Pour un démarrage efficace, la version initiale doit prioriser :
1. Gestion des membres
2. Authentification
3. Alertes journalières
4. Messages automatiques
5. Tableau de bord
6. Génération d’images
7. Intégration WhatsApp

Cela permet de livrer rapidement une version utile, puis de complexifier progressivement selon les besoins réels du bureau.

## 14. Mise à jour de l’architecture cible (05/11/2026)

### Stack finale retenue
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase pour la base de données et l’authentification
- Vercel pour le déploiement

### Raison du changement
Le projet a été initialement prototypé en Express + Vite pour valider la logique métier et le design. Cependant, le besoin client final exige une plateforme moderne, sécurisée et facilement déployable sur Vercel, avec une authentification robuste et un stockage de données professionnel.

Supabase offre la meilleure adéquation pour :
- authentification utilisateur,
- base de données PostgreSQL,
- stockage de fichiers,
- règles d’accès sécurisées,
- intégration simple avec Next.js.

### État actuel
- prototype Express + Vite conservé comme référence,
- application Next.js 16 initialisée dans `app/`,
- connexion et gestion de session Supabase mises en place,
- schéma PostgreSQL initial et politiques RLS ajoutés dans `app/supabase/migrations/`,
- configuration du projet Supabase requise avant le démarrage local.

### Prochaine phase
1. Renseigner les variables Supabase et appliquer la migration SQL.
2. Créer les comptes des responsables et promouvoir le premier super administrateur.
3. Migrer le CRUD et l’import des membres vers Supabase.
4. Alimenter le tableau de bord et le calendrier avec les données réelles.
5. Préparer le dépôt GitHub puis le déploiement sur Vercel.

---
