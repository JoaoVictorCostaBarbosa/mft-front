# Features

Cada pasta dentro de `features` representa um domínio do app.

Estrutura recomendada por feature:

- `screens/`: telas usadas pelas rotas do App Router.
- `components/`: componentes específicos da feature.
- `api/`: chamadas HTTP e adapters da API.
- `hooks/`: hooks específicos da feature.
- `types.ts`: tipos públicos do domínio.
- `index.ts`: exports públicos da feature.

Componentes compartilhados continuam em `src/components`, e componentes de design system ficam em `src/components/ui`.
