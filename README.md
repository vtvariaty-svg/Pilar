# Empreiteira Silva — Plataforma Digital

Site profissional com formulário de orçamento, painel de leads e integração Firebase.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (design mobile-first)
- **Firebase** — Hosting, Firestore, Storage, Authentication
- **React Router v6** — Roteamento SPA
- **framer-motion** — Animações
- **lucide-react** — Ícones

---

## Configurar variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha com os dados do seu projeto Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_COMPANY_NAME=Empreiteira Silva
VITE_SERVICE_REGION=Sua cidade e região
VITE_WHATSAPP_NUMBER=5511999999999
VITE_INSTAGRAM_URL=https://instagram.com/suaempreiteira
VITE_YEARS_EXPERIENCE=15+
```

---

## Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto**
3. Dê um nome (ex.: `empreiteira-silva`)
4. Aguarde a criação

---

## Ativar Authentication com e-mail e senha

1. No Firebase Console → **Authentication** → **Primeiros passos**
2. Na aba **Sign-in method**, ative **E-mail/senha**
3. Salve

---

## Criar usuário admin manualmente

1. No Firebase Console → **Authentication** → **Users**
2. Clique em **Adicionar usuário**
3. Insira o e-mail e senha do administrador
4. Clique em **Adicionar usuário**

> Não há cadastro público. Apenas usuários criados manualmente no Console têm acesso ao painel.

---

## Ativar Firestore

1. No Firebase Console → **Firestore Database** → **Criar banco de dados**
2. Selecione o modo **Produção** (as regras estão em `firestore.rules`)
3. Escolha a região mais próxima (ex.: `southamerica-east1`)

---

## Ativar Storage

1. No Firebase Console → **Storage** → **Primeiros passos**
2. Mantenha as regras padrão por enquanto (as corretas estão em `storage.rules`)
3. Clique em **Concluído**

---

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Build de produção

```bash
npm run build
```

A pasta `dist/` será gerada e está pronta para deploy.

---

## Deploy com Firebase CLI

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Autenticar

```bash
firebase login
```

### 3. Associar ao projeto

```bash
firebase use --add
```

Selecione o projeto criado no Console e dê um alias (ex.: `default`).

### 4. Fazer o deploy

```bash
firebase deploy
```

Isso publica:
- O site em **Firebase Hosting**
- As **Firestore Security Rules**
- As **Storage Security Rules**
- Os **índices do Firestore**

---

## Configurar domínio próprio (futuramente)

1. No Firebase Console → **Hosting** → **Adicionar domínio personalizado**
2. Siga as instruções para adicionar os registros DNS no seu provedor
3. O Firebase emite SSL automaticamente

---

## Próximos passos recomendados

- [ ] Adicionar fotos reais de obras no portfólio (`src/data/portfolio.ts`)
- [ ] Implementar CRUD de portfólio com Firebase Storage (`/admin/portfolio`)
- [ ] Configurar Google Analytics via Firebase
- [ ] Adicionar notificações por e-mail para novos leads (Firebase Functions + SendGrid)
- [ ] Criar sitemap.xml e robots.txt para SEO
- [ ] Conectar domínio próprio no Firebase Hosting
- [ ] Adicionar depoimentos reais em `src/data/testimonials.ts`

---

## Estrutura de pastas

```
src/
  components/
    layout/       Header, Footer
    sections/     Seções da landing page
    forms/        QuoteForm
    admin/        Painel administrativo
    ui/           Componentes reutilizáveis
  pages/          Home, Admin*, NotFound
  routes/         AppRoutes
  services/       firebase, leadsService, authService
  types/          Lead, PortfolioItem, Testimonial
  data/           portfolio, testimonials, services, faq
  utils/          whatsapp, formatDate, env
  styles/         index.css
```
