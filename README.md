# EncontraPet

Aplicação de busca de animais de estimação perdidos, construída como uma monorepo com Next.js e Payload CMS.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm 9+
- PostgreSQL

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente do backend
cd apps/backend
cp .env.example .env
# Edite .env com suas configurações do PostgreSQL

# Voltar para a raiz e iniciar ambos os servidores
cd ../..
pnpm dev
```

- Frontend: http://localhost:3000
- Backend (Payload Admin): http://localhost:3001/admin

## 📁 Estrutura do Projeto

```
EncontraPet/
├── apps/
│   ├── frontend/     # Next.js 16 + React 19 + Tailwind CSS
│   └── backend/      # Payload CMS 3.x + PostgreSQL
├── packages/         # Pacotes compartilhados (futuro)
└── biome.json        # Configuração do Biome (linter/formatter)
```

## 🛠️ Comandos Principais

```bash
# Desenvolvimento
pnpm dev              # Inicia frontend e backend
pnpm dev:frontend     # Apenas frontend
pnpm dev:backend      # Apenas backend

# Build
pnpm build            # Build de todos os apps
pnpm build:frontend   # Build apenas frontend
pnpm build:backend    # Build apenas backend

# Linting e Formatação
pnpm lint             # Lint em todos os apps
pnpm format           # Formata código com Biome
pnpm check            # Verifica e corrige problemas
```

## 🔧 Stack Tecnológica

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Payload CMS 3.x, Next.js 15, PostgreSQL
- **Monorepo**: pnpm workspaces
- **Linter/Formatter**: Biome

## 📖 Documentação

Para mais detalhes sobre a arquitetura e desenvolvimento, consulte [CLAUDE.md](./CLAUDE.md).
