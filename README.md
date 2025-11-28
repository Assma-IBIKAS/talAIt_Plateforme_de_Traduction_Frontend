# 🎨 TalAIt Translation Platform - Frontend

## 📋 Description

Interface web moderne développée en **Next.js** avec **React** et **TypeScript** pour la plateforme de traduction TalAIt.

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│  ┌───────────┐    ┌──────────────┐  │
│  │  /login   │    │  /register   │  │
│  └─────┬─────┘    └──────┬───────┘  │
│        │                 │          │
│        └────────┬────────┘          │
│                 ▼                   │
│        ┌──────────────┐             │
│        │  /translate  │             │
│        └──────┬───────┘             │
└───────────────┼─────────────────────┘
                │ JWT Bearer Token
                ▼
        ┌──────────────┐
        │  Backend API │
        │   (FastAPI)  │
        └──────────────┘
```

## 🛠️ Technologies Utilisées

- **Framework**: Next.js  (App Router)
- **Language**: TypeScript
- **UI Library**: React 
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Fetch API native
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router
- **Authentification**: JWT (localStorage)


## 📦 Prérequis

- Node.js 
- npm ou yarn ou pnpm
- Backend API lancé sur `http://localhost:8000`

## ⚙️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Assma-IBIKAS/talAIt_Plateforme_de_Traduction_Frontend.git

```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

## 🚀 Lancement

### Mode développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)


### Avec Docker

```bash
# Build l'image
docker build -t talait-frontend .

# Lancer le conteneur
docker run -p 3000:3000 talait-frontend
```

### Avec Docker Compose

```bash
# Depuis la racine du projet
docker-compose up -d frontend
```

## 📁 Structure du Projet

```
frontend/
├── app/
│   ├── layout.tsx           # Layout racine
│   ├── page.tsx             # Page d'accueil (redirect)
│   ├── globals.css          # Styles globaux
│   ├── login/
│   │   └── page.tsx         # Page de connexion
│   ├── register/
│   │   └── page.tsx         # Page d'inscription
│   └── translate/
│       └── page.tsx         # Page de traduction
├── public/
│   ├── favicon.ico
│   └── images/
├── types/
│   └── index.ts             # Types TypeScript
├── Dockerfile
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🔐 Pages et Fonctionnalités

### 🏠 Page d'Accueil (`/`)

Redirection automatique :
- Si JWT valide → `/translate`
- Si non authentifié → `/login`

---

### 🔑 Page Login (`/login`)

**Fonctionnalités:**
- Formulaire username + password
- Validation côté client
- Appel API `/login`
- Stockage JWT en localStorage
- Redirection vers `/translate`
- Messages d'erreur stylisés
- Lien vers page register

**Code exemple:**
```typescript
const handleLogin = async () => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password })
  });
  const data = await res.json();
  localStorage.setItem('access_token', data.access_token);
  router.push('/translate');
};
```

---

### 📝 Page Register (`/register`)

**Fonctionnalités:**
- Formulaire création de compte
- Validation password (min 8 caractères)
- Appel API `/register`
- Message de succès
- Auto-redirection vers `/login` après 2s
- Gestion des erreurs (username déjà pris, etc.)

---

### 🌐 Page Translate (`/translate`)

**Fonctionnalités principales:**

1. **Interface de traduction**
   - Textarea pour le texte source
   - Select direction (FR→EN / EN→FR)
   - Bouton "Traduire"

2. **Résultats**
   - Affichage de résultat
   - Gestion erreurs (token invalide, API down)

**Protection:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.push('/login'); // Redirection si non authentifié
  }
}, []);
```

**Appel API:**
```typescript
const handleTranslate = async () => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text, direction })
  });
  const data = await res.json();
  setTranslatedText(data.translation);
};
```

## 🎯 Workflow Utilisateur

```
1. Accès à l'app
   ↓
2. Redirection automatique
   ├─ Si authentifié → /translate
   └─ Si non auth → /login
   ↓
3. Login ou Register
   ↓
4. Réception JWT
   ↓
5. Stockage en localStorage
   ↓
6. Accès à /translate
   ↓
7. Saisie texte + choix direction
   ↓
8. Click "Execute()"
   ↓
9. Envoi requête avec JWT
   ↓
10. Affichage résultat
    ↓
11. Logout → suppression JWT → retour /login
```

## 🔒 Gestion de l'Authentification

### Stockage du Token

```typescript
// Après login réussi
localStorage.setItem('access_token', token);
localStorage.setItem('username', username);

// Lecture du token
const token = localStorage.getItem('access_token');

// Logout
localStorage.removeItem('access_token');
localStorage.removeItem('username');
```

### Protection des Routes

```typescript
// Dans chaque page protégée
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.push('/login');
  }
}, [router]);
```

### Envoi du Token

```typescript
// Headers pour toutes les requêtes protégées
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## ⚠️ Gestion des Erreurs

### Codes d'erreur gérés

| Code | Action Frontend |
|------|-----------------|
| 401 | Redirect to /login + message |
| 403 | Show "Accès refusé" |
| 422 | Validation errors display |
| 500 | "Erreur serveur" message |
| 503 | "Service temporairement indisponible" |

### Exemple de gestion

```typescript
try {
  const res = await fetch(url, options);
  const data = await res.json();
  
  if (!res.ok) {
    setError(data.detail || 'Une erreur est survenue');
    return;
  }
  
  // Success
} catch (err) {
  setError('Erreur réseau ou serveur');
}
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
CMD ["npm","run","dev"]
```

### Docker Compose

```yaml
  frontend:
    build:
      context: ./talAIt_Plateforme_de_Traduction_Frontend
      dockerfile: Dockerfile
    container_name: talait_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🐛 Troubleshooting

### Problème: Token expiré

```typescript
// Vérifier expiration
if (res.status === 401) {
  localStorage.removeItem('access_token');
  router.push('/login');
}
```

### Problème: CORS errors

```bash
# Vérifier que le backend autorise l'origin
# Backend config (FastAPI):
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
---

**Crafted with 💜 by TalAIt Design Team**