# Zombie Plus — Testes E2E com Playwright

Projeto de automação de testes para praticar desenvolvido com Playwright

---

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

---

## Pré-requisitos — Subindo a aplicação

A pasta `app/zombieplus/` contém a **aplicação sendo testada (SUT)**. Os testes dependem dela estar em execução antes de rodar.

### 1. Banco de dados (Docker)

```bash
docker compose -f app/zombieplus/docker-compose.yml up -d
```

| Serviço    | Endereço                  | Credenciais                        |
|------------|---------------------------|------------------------------------|
| PostgreSQL | `localhost:5432`          | usuário `postgres` / senha `pwd123` |
| pgAdmin    | `http://localhost:16543`  | `admin@qax.com` / `pwd123`         |

### 2. API (backend)

```bash
cd app/zombieplus/api
npm install     # apenas na primeira vez
npm run dev     # inicia em http://localhost:3333
```

### 3. Frontend (web)

```bash
cd app/zombieplus/web
npm install     # apenas na primeira vez
npm run dev     # serve o build em http://localhost:3000
```

> Os três serviços devem estar no ar antes de executar qualquer teste.

---

## Instalação dos testes

```bash
npm install
npx playwright install
```

Copie o arquivo de variáveis de ambiente (opcional para desenvolvimento local):

```bash
cp .env.example .env
```

---

## Execução dos testes

```bash
# Todos os testes
npx playwright test

# Modo headed (com browser visível)
npx playwright test --headed

# Apenas um arquivo
npx playwright test tests/e2e/movies.spec.js

# Abrir relatório HTML
npx playwright show-report
```

---

## Estrutura do projeto

```
.
├── playwright.config.js          # Configuração central (reporters, timeouts, CI/CD)
├── package.json
├── .env.example                  # Variáveis de ambiente disponíveis
│
├── app/                          # ← Aplicação sendo testada (SUT)
│   └── zombieplus/
│       ├── docker-compose.yml    # PostgreSQL + pgAdmin
│       ├── api/                  # Backend Node.js/Express  → porta 3333
│       └── web/                  # Frontend React (build)   → porta 3000
│
└── tests/
    ├── e2e/                      # Specs organizados por funcionalidade
    │   ├── login.spec.js
    │   ├── leads.spec.js
    │   └── movies.spec.js
    │
    ├── fixtures/
    │   └── index.js              # Fixtures customizados (test + expect)
    │
    ├── pages/                    # Page Objects (POM)
    │   ├── LoginPage.js
    │   ├── MoviesPage.js
    │   ├── LeadsPage.js
    │   └── components/
    │       ├── Popup.js          # Componente SweetAlert2
    │       └── Dropdown.js       # Componente React Select
    │
    ├── global.setup.js           # Setup global de autenticação
    │
    └── support/
        ├── api/
        │   └── index.js          # Cliente HTTP autenticado (Api)
        ├── database/
        │   └── index.js          # Helpers de acesso ao PostgreSQL
        └── fixtures/
            ├── movies.json       # Massa de dados dos testes de filmes
            └── covers/movies/    # Imagens usadas nos uploads de capa
```

---

## Arquitetura

### Page Object Model (POM)

Cada tela da aplicação tem um Page Object dedicado em `tests/pages/`. Os métodos seguem a convenção de prefixos para diferenciar ações de asserções:

| Prefixo       | Exemplo                       | Tipo       |
|---------------|-------------------------------|------------|
| `fill*`       | `fillTitle(title)`            | Ação       |
| `select*`     | `selectCompany(company)`      | Ação       |
| `go*` / `visit` | `goToList()`, `visit()`    | Navegação  |
| `submit` / `click*` | `submit()`, `goBack()` | Ação       |
| `expect*`     | `expectLoggedIn('Admin')`     | Asserção   |

### Fixtures

Os fixtures em `tests/fixtures/index.js` estendem o `test` do Playwright com injeção automática dos Page Objects e do cliente de API:

| Fixture       | Tipo          | Descrição                                        |
|---------------|---------------|--------------------------------------------------|
| `loginPage`   | `LoginPage`   | Tela de login (`/admin/login`)                   |
| `moviesPage`  | `MoviesPage`  | Listagem e cadastro de filmes (`/admin/movies`)  |
| `leadsPage`   | `LeadsPage`   | Página pública de leads (`/`)                    |
| `popup`       | `Popup`       | Componente de feedback SweetAlert2               |
| `api`         | `Api`         | Cliente HTTP autenticado para setup de dados     |

### Componentes reutilizáveis

- **`Popup`** — encapsula interações com os dialogs SweetAlert2 (`expectText`, `confirm`)
- **`Dropdown`** — encapsula o React Select com suporte a busca, seleção e asserções

### Autenticação nos testes

A aplicação armazena a sessão em `sessionStorage` (e não em cookies), o que impede o uso direto do `storageState` do Playwright. A solução adotada:

1. O fixture `page` detecta se o teste é de filmes (`movies.spec`)
2. Obtém o token JWT via `POST /sessions` antes de cada teste
3. Usa `context.addInitScript()` para injetar o token no `sessionStorage` antes de qualquer `page.goto()`
4. Os testes de login usam `test.use({ storageState: { cookies: [], origins: [] } })` para garantir sessão limpa

### Camada de dados

- **`Api`** — cria dados de teste via API REST (sem passar pela UI), isolando pré-condições
- **`database/index.js`** — executa queries parametrizadas no PostgreSQL para limpeza de estado (`deleteMovieByTitle`, `deleteLeadByEmail`, etc.)
- **`movies.json`** — centraliza as massas de dados dos cenários de filmes (criação, remoção, duplicação e busca)
- **Faker** — gera nomes e e-mails dinâmicos nos testes de leads para evitar conflitos entre execuções

---

## Boas práticas aplicadas

- **Page Object Model** — cada tela tem sua própria classe com responsabilidades bem definidas
- **Fixtures tipadas** — injeção de dependências declarativa via `test.extend()`
- **Componentes reutilizáveis** — `Popup` e `Dropdown` compartilhados entre Page Objects
- **Asserções web-first** — uso de `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()` (sem hard waits)
- **Separação ações × asserções** — métodos de ação não fazem `expect`; asserções têm prefixo `expect*`
- **Queries parametrizadas** — `executeSQL('DELETE FROM movies WHERE title = $1', [title])` (sem SQL injection)
- **Seletores semânticos** — `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`
- **Variáveis de ambiente** — URLs e credenciais via `process.env` com fallback para desenvolvimento local
- **CI/CD ready** — `forbidOnly`, `retries`, `workers: 1`, reporters `html` + `list`, captura de screenshot/vídeo/trace em falhas

---

## Variáveis de ambiente

| Variável        | Padrão                    | Descrição                        |
|-----------------|---------------------------|----------------------------------|
| `BASE_URL`      | `http://localhost:3000`   | URL do frontend                  |
| `API_BASE_URL`  | `http://localhost:3333`   | URL da API backend               |
| `ADMIN_EMAIL`   | `admin@zombieplus.com`    | E-mail do usuário admin          |
| `ADMIN_PASSWORD`| `pwd123`                  | Senha do usuário admin           |
| `DB_HOST`       | `localhost`               | Host do PostgreSQL               |
| `DB_PORT`       | `5432`                    | Porta do PostgreSQL              |
| `DB_NAME`       | `zombieplus`              | Nome do banco de dados           |
| `DB_USER`       | `postgres`                | Usuário do banco de dados        |
| `DB_PASSWORD`   | `pwd123`                  | Senha do banco de dados          |
