# 🚀 Deployment Guide - Netlify

Ce guide explique comment déployer l'application sur Netlify avec toutes les configurations nécessaires.

## ✅ Prérequis

- Compte Netlify (https://netlify.com)
- Git repository pushé sur GitHub
- Clés Twilio activées
- Supabase configuré

## 📋 Variables d'Environnement Required

Voici les **variables d'environnement** qu'il faut configurer sur Netlify :

### 1️⃣ Supabase (Base de Données)
```
SUPABASE_URL=https://hwglhastcmqgrvvxmaae.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z2xoYXN0Y21xZ3J2dnhtYWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDMzNzgsImV4cCI6MjA4OTI3OTM3OH0.AygQOrS3YAvUgbjHW_ypCMWNqH7pIY6U6NUm7Pgt_Go
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z2xoYXN0Y21xZ3J2dnhtYWFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzcwMzM3OCwiZXhwIjoyMDg5Mjc5Mzc4fQ.d7Hp-2bpZqvB673ZGE09Eii-BJSo5SZfZvlVSDn5uBc
```

**Où les trouver :** https://app.supabase.com/project > Settings > API

### 2️⃣ Twilio (WhatsApp Notifications)
```
TWILIO_ACCOUNT_SID=AC263af387b4c70921cf392a7b125de152
TWILIO_AUTH_TOKEN=e6a72ccccfeb9e2de21f768afd5cafa1
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP=whatsapp:+212612989463
```

**Où les trouver :** https://console.twilio.com > Account > API Keys

---

## 🔧 Configuration sur Netlify

### Étape 1️⃣ : Connecter votre Git Repository

1. Allez sur **https://app.netlify.com**
2. Cliquez sur **"New site from Git"**
3. Sélectionnez **GitHub** et autorisez l'accès
4. Choisissez votre repository `mrinconnu21-cmyk/Portail.web1.0`

### Étape 2️⃣ : Configurer les Build Settings

1. **Build command:** `pnpm build`
2. **Publish directory:** `dist/spa`
3. **Functions directory:** `netlify/functions` (optionnel, déjà créé)

**Note:** Le fichier `netlify.toml` à la racine du projet configure automatiquement cela.

### Étape 3️⃣ : Ajouter les Variables d'Environnement

1. Dans **Netlify Dashboard** → Votre site → **Settings** → **Environment variables**
2. Cliquez sur **"Add variable"**
3. Pour chaque variable de la section "Variables d'Environnement Required" ci-dessus :
   - Collez la clé et la valeur
   - Validez

**Variables à ajouter :**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `ADMIN_WHATSAPP`

### Étape 4️⃣ : Trigger le Déploiement

1. Allez sur **Deployments**
2. Cliquez sur le dernier déploiement **"Failed"** ou attendez une nouveau push
3. Attendez que le build se termine ✓

---

## 🧪 Test après Déploiement

### Vérifier que tout fonctionne :

1. **Ouvrir le site :** https://votre-site.netlify.app
2. **Tester la connexion login :** 
   - Aller sur `/login`
   - Entrer un compte existant
3. **Tester les idées WhatsApp :**
   - Aller sur `/ideas`
   - Soumettre une idée
   - Vérifier que tu reçois le message WhatsApp

### Debug si ça ne marche pas :

1. **Vérifier les logs de build :**
   - Netlify Dashboard → **Deployments** → Dernier déploiement → **Deploy log**
   
2. **Vérifier les logs de fonction :**
   - Netlify Dashboard → **Functions** → Voir les logs

3. **Vérifier les env vars :**
   - Settings → Environment variables
   - Vérifier qu'aucune variable n'est vide ou incorrecte

---

## 📝 Structure du Projet pour Netlify

```
project/
├── netlify.toml              ← Config Netlify (IMPORTANT!)
├── netlify/functions/
│   └── api.ts               ← Serverless function wrapper
├── dist/
│   ├── spa/                 ← Frontend assets (HTML, CSS, JS)
│   └── server/              ← Backend code
├── client/                  ← React code
├── server/                  ← Express API
├── package.json
└── pnpm-lock.yaml
```

---

## 🚨 Problèmes Courants

### ❌ "Twilio non configuré"
**Cause :** Variables Twilio manquantes ou vides
**Solution :** 
1. Vérifier que `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, etc. sont dans Netlify
2. Redéployer après l'ajout des variables

### ❌ "Supabase connection failed"
**Cause :** Clés Supabase incorrectes ou réseau bloqué
**Solution :**
1. Vérifier que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont correctes
2. Vérifier que Supabase est accessible publiquement (pas de firewall)

### ❌ "SPA Routes not working (404)"
**Cause :** Les redirects dans `netlify.toml` ne sont pas appliquées
**Solution :**
1. Vérifier que `netlify.toml` est à la racine du repo
2. Redéployer après modification

---

## ✅ Checklist Final

- [ ] Repository GitHub connecté à Netlify
- [ ] Build command = `pnpm build`
- [ ] Publish directory = `dist/spa`
- [ ] Toutes les env vars Supabase ajoutées
- [ ] Toutes les env vars Twilio ajoutées
- [ ] Premier déploiement réussi (status: "Published")
- [ ] Site accessible via URL Netlify
- [ ] Login fonctionne
- [ ] Soumettre une idée fonctionne + message WhatsApp reçu
- [ ] Vérifier les logs pour les erreurs

---

## 🎯 Commandes Utiles

```bash
# Tester le build localement
pnpm build

# Lancer le serveur de production localement
pnpm start

# Vérifier les types TypeScript
pnpm typecheck
```

---

**C'est tout !** Une fois que le déploiement est réussi, le site sera **100% fonctionnel** en production. 🚀
