# Zombie Plus - E2E Tests

Projeto de automação de testes end-to-end desenvolvido com Playwright para validar os principais fluxos da aplicação Zombie Plus.

## Cobertura de testes

- Login administrativo com sucesso
- Validações de login com credenciais inválidas
- Validações de campos obrigatórios no login
- Cadastro de leads na fila de espera
- Validação de e-mail já cadastrado na fila de espera
- Cadastro de filme no painel administrativo
- Validação de mensagens toast e alertas de formulário

## Tecnologias

- Node.js
- Playwright Test
- JavaScript ES Modules
- Faker
- PostgreSQL
- `pg`

## Estrutura do projeto

```bash
.
├── playwright.config.js
├── package.json
├── tests/
│   ├── e2e/
│   │   ├── leads.spec.js
│   │   ├── login.spec.js
│   │   └── movies.spec.js
│   ├── pages/
│   │   ├── Components.js
│   │   ├── LandingPage.js
│   │   ├── LoginPage.js
│   │   └── MoviesPage.js
│   └── support/
│       ├── database.js
│       ├── index.js
│       └── fixtures/
│           └── movies.json
```

## Pré-requisitos

Antes de executar os testes, mantenha os serviços da aplicação disponíveis:

- Aplicação web em `http://localhost:3000`
- API/backend em `http://localhost:3333`
- PostgreSQL com o banco `zombieplus`
- Banco configurado com usuário `postgres`, senha `pwd123` e porta `5432`
- Usuário admin da aplicação: `admin@zombieplus.com` / `pwd123`

## Instalação

Instale as dependências do projeto:

```bash
npm install
```

Instale os navegadores usados pelo Playwright:

```bash
npx playwright install
```

## Execução dos testes

Executar todos os testes:

```bash
npx playwright test
```

Executar testes em modo headed:

```bash
npx playwright test --headed
```

Abrir o relatório HTML do Playwright:

```bash
npx playwright show-report
```

## Arquitetura

Os testes ficam em `tests/e2e` e são organizados por fluxo funcional: login, leads e filmes.

As telas e ações reutilizáveis ficam em `tests/pages`, seguindo o padrão Page Object Model. A fixture customizada em `tests/support/index.js` estende o objeto `page` do Playwright com os atalhos `landing`, `login`, `movies` e `toast`.

O arquivo `tests/support/database.js` centraliza a execução de comandos SQL no PostgreSQL para preparar dados antes dos testes. As massas de filmes usadas nos cenários ficam em `tests/support/fixtures/movies.json`.

O projeto está configurado para executar no Chromium e gerar relatório HTML com o reporter padrão do Playwright.

## Boas práticas e técnicas usadas

- Page Object Model para separar regras de interação com a interface dos cenários de teste
- Fixtures customizadas para centralizar a criação e o acesso aos objetos de página
- Massa de dados externa em JSON para facilitar manutenção dos cenários de filmes
- Dados dinâmicos com Faker para reduzir conflito entre execuções de testes de leads
- Preparação de massa via banco de dados antes do cadastro de filme
- Validações por seletores semânticos, como `getByRole`, `getByLabel`, `getByPlaceholder` e `getByTestId`
- Validação de feedback visual por mensagens toast e alertas de formulário
- Reuso de componentes comuns, como o componente `Toast`
- Testes independentes por fluxo funcional
- Relatório HTML do Playwright para análise das execuções
- Trace em primeira retentativa para apoiar investigação de falhas em ambiente de CI
