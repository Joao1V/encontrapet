# 🐾 EncontraPet

> Plataforma para busca e registro de animais de estimação perdidos ou encontrados

Aplicação full-stack construída como monorepo moderno usando **Turborepo**, com frontend em **Next.js 15** e backend em **Payload CMS 3**.

[![Made with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Powered by Payload CMS](https://img.shields.io/badge/Payload_CMS-3.62-blue)](https://payloadcms.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.6-EF4444)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-10.19.0-F69220)](https://pnpm.io/)

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 20.9.0+ ou 22.x
- **pnpm** 10.19.0 (instalado automaticamente via Corepack)
- **PostgreSQL** 14+
- **AWS S3** (ou bucket compatível) para storage de imagens

### Instalação

```bash
# Clone o repositório
git clone <seu-repo>
cd encontra-pet

# Instalar dependências (pnpm será instalado automaticamente via packageManager)
pnpm install

# Configurar variáveis de ambiente
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env

# Edite os arquivos .env com suas credenciais
# Frontend: NEXTAUTH_SECRET, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Backend: DATABASE_URI, PAYLOAD_SECRET, S3_*

# Iniciar ambiente de desenvolvimento
pnpm dev
```

**URLs de desenvolvimento:**
- 🎨 Frontend: [http://localhost:3000](http://localhost:3000)
- 🔧 Backend Admin: [http://localhost:3001/admin](http://localhost:3001/admin)
- 📚 API Docs: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 📁 Estrutura do Monorepo

```
encontra-pet/
├── apps/
│   ├── frontend/              # Aplicação Next.js do usuário
│   │   ├── src/
│   │   │   ├── app/          # App Router (Next.js 15)
│   │   │   ├── components/   # Componentes React
│   │   │   └── lib/          # Utilidades e configs
│   │   ├── tailwind.config.ts
│   │   └── next.config.ts
│   │
│   └── backend/               # Payload CMS + API
│       ├── src/
│       │   ├── collections/  # Collections do Payload
│       │   ├── payload.config.ts
│       │   └── server.ts
│       └── next.config.mjs
│
├── packages/
│   └── utils/                # Pacote compartilhado
│
├── turbo.json                # Configuração do Turborepo
├── pnpm-workspace.yaml       # Workspaces do pnpm
├── biome.json                # Linter e formatter
└── package.json              # Scripts root e packageManager
```

---

## 🛠️ Comandos Disponíveis

### Desenvolvimento

```bash
pnpm dev              # Inicia todos os apps em paralelo (com Turbo)
pnpm dev:frontend     # Apenas frontend (porta 3000)
pnpm dev:backend      # Apenas backend/CMS (porta 3001)
```

### Build & Produção

```bash
pnpm build            # Build otimizado de todos os apps
pnpm build:frontend   # Build apenas do frontend
pnpm build:backend    # Build apenas do backend
pnpm start            # Inicia apps em modo produção
```

### Qualidade de Código

```bash
pnpm lint             # Executa lint em todos os apps
pnpm check-types      # Valida TypeScript
pnpm format           # Formata código com Biome
pnpm check            # Verifica e corrige problemas (Biome)
```

### Testes

```bash
pnpm test             # Executa todos os testes
pnpm test:e2e         # Testes E2E (Playwright - backend)
pnpm test:int         # Testes de integração (Vitest - backend)
```

### Limpeza

```bash
pnpm clean            # Remove cache e node_modules
pnpm clean:cache      # Remove apenas .next e .turbo
pnpm clean:all        # Limpeza completa + reinstala
```

---

## 🔧 Stack Tecnológica

### Frontend
- **Framework**: Next.js 15.4.7 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4 + HeroUI
- **Forms**: React Hook Form + Zod
- **State**: Zustand + TanStack Query
- **Auth**: NextAuth.js v4
- **Maps**: Google Maps API

### Backend
- **CMS**: Payload CMS 3.62.0
- **Database**: PostgreSQL (via @payloadcms/db-postgres)
- **Storage**: AWS S3 (via @payloadcms/storage-s3)
- **Runtime**: Next.js 15.4.7
- **Email**: Nodemailer (configurável)

### Tooling
- **Monorepo**: Turborepo 2.6.0 (com cache inteligente)
- **Package Manager**: pnpm 10.19.0 (workspaces)
- **Linter/Formatter**: Biome 2.3.2
- **TypeScript**: 5.x (strict mode)
- **Git Hooks**: Husky (opcional)

---

## 🌍 Deploy

### Vercel

O projeto está configurado para deploy na Vercel com suporte completo a monorepo:

## 📦 Turborepo

O projeto usa Turborepo para builds otimizados:

- ⚡ **Cache inteligente** de builds e testes
- 🔄 **Execução paralela** de tarefas
- 📊 **Análise de dependências** entre pacotes
- 🚀 **Remote caching** (configurável)

O Turborepo detecta automaticamente quais pacotes mudaram e executa apenas o necessário.

---

## 🔐 Variáveis de Ambiente

### Frontend (`apps/frontend/.env`)

```env
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-key-aqui
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-secret-aqui
```

### Backend (`apps/backend/.env`)

```env
DATABASE_URI=postgresql://user:password@localhost:5432/encontrapet
PAYLOAD_SECRET=sua-secret-longa-e-aleatoria

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-app

# AWS S3
S3_BUCKET=encontrapet-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=sua-key
S3_SECRET_ACCESS_KEY=sua-secret
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---
