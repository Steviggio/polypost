# ⚡ PolyPost

**Automatisation de posts LinkedIn multilingues via Mistral AI.**

Ce projet est un PoC (Proof of Concept) minimaliste démontrant l'intégration de l'IA générative dans une architecture **Next.js 16** moderne. Il orchestre la création, la traduction automatique et la gestion d'utilisateurs sécurisée.

## 🛠 Stack Technique | Teck Stack

- **Frontend** : Next.js 16 (App Router), Tailwind CSS.
- **Backend** : Node.js, Express, Prisma ORM.
- **Services** : Mistral AI (LLM), Clerk (Auth), PostgreSQL (Data).
- **Ops** : Docker & Docker Compose.

## 🚀 Démarrage Rapide | Quick launch

**Pré-requis** : Docker Desktop installé.

<h6>Voici les éléments à installer pour faire fonctionner le projet :</h6>

- [Docker desktop](https://docs.docker.com/desktop/)
- [git](https://git-scm.com/install/)

Il faut créer un fichier .env à créer à la racine du projet

```bash
# API Keys (Clerk & Mistral)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_......
CLERK_SECRET_KEY=sk_test_......
MISTRAL_API_KEY=TaCleMistralIci

# URLs
NEXT_PUBLIC_API_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
```

### Installation & Lancement | Install & Launch

1. **Cloner le projet** :

```bash
git clone [https://github.com/Steviggio/polypost.git](https://github.com/Steviggio/polypost.git)
cd polypost
```

2. **Lancer les conteneurs** :

```bash
docker-compose up --build
```

3. **Initialiser la base de données (Une fois les conteneurs lancés) : Ouvrez un nouveau terminal et lancez** :

```bash
docker exec -it polypost_backend npx prisma migrate deploy
```

🌐 Accès : Ouvrez http://localhost:3000
