# Lucas Mendes — Portfólio

Portfólio pessoal em forma de site, com interface inspirada na UI do **Final Fantasy XV**
(painéis HUD translúcidos, acentos em ciano, menu lateral retrátil).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** para estilização
- **next-intl** para internacionalização (🇧🇷 pt-BR / 🇺🇸 EN)
- **Framer Motion** para transições suaves
- **lucide-react** para ícones

## Estrutura

```
src/
├── app/[locale]/        # páginas por seção do currículo
│   ├── page.tsx         # Sobre (home / hero)
│   ├── experience/      # Experiência
│   ├── projects/        # Projetos & Acadêmico
│   ├── education/       # Formação
│   ├── skills/          # Habilidades
│   └── contact/         # Contato
├── components/          # componentes reutilizáveis (Sidebar, Panel, etc.)
├── messages/            # conteúdo traduzido (pt.json / en.json)
├── data/profile.ts      # dados de contato e ordem das seções
└── i18n/                # configuração do next-intl
```

Todo o conteúdo textual vive em `src/messages/{pt,en}.json`. Para editar o currículo,
basta alterar esses dois arquivos — os componentes são genéricos.

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
