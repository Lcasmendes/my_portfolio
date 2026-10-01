# Lucas Mendes — Portfólio

Portfólio pessoal em uma página única: fundo navy chapado, hero em formato de pôster
(a palavra INTERFACE vira DADO enquanto a rolagem fica presa no hero) e detalhes
inspirados nos menus de Final Fantasy (seleção por inversão, losangos, barra de abas).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (base) + classes de componente em `src/app/globals.css`
- **next-intl** para internacionalização (🇧🇷 pt-BR / 🇺🇸 EN)
- Fontes **Geist** e **Geist Mono** via `next/font`

## Estrutura

```
src/
├── app/[locale]/
│   ├── page.tsx         # página única: hero, projetos, habilidades, trajetória, contato
│   ├── journey/ projects/ skills/   # rotas antigas, redirecionam para a seção da home
│   └── not-found.tsx
├── components/          # SiteHeader, HeroPoster, SkillTabs, QuestLog, CopyEmail, SiteFooter
├── messages/            # conteúdo traduzido (pt.json / en.json)
├── data/                # contato (profile.ts) e SEO (site.ts)
└── i18n/                # configuração do next-intl
```

Todo o conteúdo textual vive em `src/messages/{pt,en}.json`, alinhado com o currículo em
`public/cv/`. Para atualizar o site, basta alterar esses dois arquivos.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000) (redireciona para `/pt`).

## Build de produção

```bash
npm run build
npm start
```

## Deploy gratuito na Vercel

1. Suba esta pasta `portfolio/` para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o Next.js automaticamente — não precisa configurar nada.
4. Clique em **Deploy**. Pronto: o site fica disponível em `https://<seu-projeto>.vercel.app`.

> Se o repositório tiver a pasta `portfolio/` dentro de outro diretório, defina o
> **Root Directory** como `portfolio` nas configurações do projeto na Vercel.
