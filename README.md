# Zombie Plus - E2E Tests

Projeto de automação de testes end-to-end desenvolvido com Playwright para validar os principais fluxos da aplicação Zombie Plus.

## Cobertura de testes

**Login**
- Login administrativo com sucesso
- Tentativa com senha incorreta
- Tentativa com e-mail inválido
- Validação de campo e-mail vazio
- Validação de campo senha vazio
- Validação de ambos os campos vazios

**Fila de espera (Leads)**
- Cadastro de lead com sucesso
- Rejeição de e-mail já registrado (via API)
- Validação de e-mail com formato incorreto
- Validação de campo e-mail vazio
- Validação de campo nome vazio
- Validação de ambos os campos vazios

**Filmes**
- Cadastro de filme com sucesso
- Remoção de filme do catálogo
- Rejeição de título duplicado
- Validação de campos obrigatórios
- Busca por termo no catálogo

## Tecnologias

- Node.js
- Playwright Test
- JavaScript ES Modules
- Faker
- PostgreSQL
- `pg`

## Estrutura do projeto

```
.
├── playwright.config.js
├── package.json
├── tests/
│   ├── e2e/
│   │   ├── leads.spec.js
│   │   ├── login.spec.js
│   │   └── movies.spec.js
│   └── support/
│       ├── actions/
│       │   ├── Components.js
│       │   ├── Leads.js
│       │   ├── Login.js
│       │   └── Movies.js
│       ├── api/
│       │   └── index.js
│       ├── fixtures/
│       │   ├── covers/
│       │   │   └── movies/      ← imagens usadas no upload de capas
│       │   └── movies.json
│       ├── database.js
│       └── index.js
```

## Pré-requisitos

Antes de executar os testes, mantenha os serviços da aplicação disponíveis:

- Aplicação web em `http://localhost:3000`
- API/backend em `http://localhost:3333`
- PostgreSQL com o banco `zombieplus`
- Banco configurado com usuário `postgres`, senha `pwd123` e porta `5432`
- Usuário admin da aplicação: `admin@zombieplus.com` / `pwd123`

A variável de ambiente `DB_HOST` pode ser usada para apontar o host do banco em ambientes distintos (padrão: `localhost`).

### Subindo o banco com Docker

O projeto inclui um `docker-compose.yml` que sobe o PostgreSQL e o pgAdmin:

```bash
docker compose up -d
```

Serviços disponíveis após o comando:

| Serviço | URL / Host | Credenciais |
|---|---|---|
| PostgreSQL | `localhost:5432` | usuário `postgres` / senha `pwd123` |
| pgAdmin | `http://localhost:16543` | `admin@qax.com` / `pwd123` |

## Instalação

```bash
npm install
npx playwright install
```

## Execução dos testes

Executar todos os testes:

```bash
npx playwright test
```

Executar em modo headed:

```bash
npx playwright test --headed
```

Abrir o relatório HTML:

```bash
npx playwright show-report
```

## Arquitetura

Os testes ficam em `tests/e2e`, organizados por fluxo funcional: login, leads e filmes.

As ações reutilizáveis ficam em `tests/support/actions`, seguindo o padrão Action Objects (derivado do Page Object Model). Cada classe encapsula as interações de um contexto específico:

| Classe | Arquivo | Responsabilidade |
|---|---|---|
| `LoginPage` | `Login.js` | Navegação e submissão do formulário de login |
| `Leads` | `Leads.js` | Abertura do modal e cadastro na fila de espera |
| `MoviesPage` | `Movies.js` | Cadastro, remoção, busca e validações de filmes |
| `Popup` | `Components.js` | Verificação de mensagens SweetAlert2 |

A fixture customizada em `tests/support/index.js` estende os objetos `page` e `request` do Playwright:

- `page.login` → instância de `LoginPage`
- `page.Leads` → instância de `Leads`
- `page.movies` → instância de `MoviesPage`
- `page.popup` → instância de `Popup`
- `request.api` → instância de `Api` (autenticada automaticamente)

A classe `Api` em `tests/support/api/index.js` centraliza chamadas HTTP autenticadas para criação de dados de teste via API, obtendo token na fixture antes de cada teste.

O arquivo `tests/support/database.js` centraliza a execução de comandos SQL no PostgreSQL para limpeza de dados antes dos testes.

As massas de dados ficam em `tests/support/fixtures/movies.json` (cenários de criação, remoção, duplicação e busca) e as imagens de capa em `tests/support/fixtures/covers/movies/`.

## Boas práticas e técnicas usadas

- Action Objects para separar regras de interação da interface dos cenários de teste
- Fixtures customizadas que estendem `page` e `request` com objetos de ação e API
- Camada de API (`Api`) para criar dados de teste programaticamente, sem depender da UI
- Preparação de dados via SQL para garantir estado limpo antes de cada cenário
- Massa de dados externa em JSON para facilitar manutenção dos cenários de filmes
- Dados dinâmicos com Faker para evitar conflito entre execuções de testes de leads
- Seletores semânticos: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`
- Validação de feedback visual por popups SweetAlert2 e alertas de formulário
- Testes independentes por fluxo funcional
- Relatório HTML do Playwright para análise das execuções
- Trace em primeira retentativa para apoiar investigação de falhas em CI
- Suporte à variável `DB_HOST` para execução em diferentes ambientes
