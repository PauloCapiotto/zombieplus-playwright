# Plano de Testes - Cadastro de Filmes ZombiePlus

## Application Overview

ZombiePlus é uma aplicação de streaming de filmes de zumbis com painel administrativo que permite gerenciar o catálogo de filmes. O painel é acessível em http://localhost:3000/admin e exige autenticação. A seção de filmes (/admin/movies) lista todos os filmes cadastrados e permite cadastrar novos via formulário em /admin/movies/register. O formulário contém os seguintes campos: Titulo do filme (texto, obrigatório), Sinopse (textarea, obrigatório), Distribuido por (dropdown com busca - 10 opções fixas, obrigatório), Ano de lançamento (dropdown com anos de 1970 a 2024, obrigatório), Poster (upload de arquivo de imagem, opcional) e Conteúdo destaque? (toggle switch, opcional, padrão desligado). Ao cadastrar com sucesso, o sistema exibe o dialog "Otima noticia!" confirmando o titulo adicionado ao catalogo e redireciona para a listagem. Em caso de titulo duplicado, exibe dialog "Atencao!" com mensagem especifica. Campos obrigatorios nao preenchidos exibem a mensagem "Campo obrigatorio" individualmente abaixo de cada campo.

## Test Scenarios

### 1. Cadastro de Filmes - Happy Path

**Seed:** `tests/seed.spec.ts`

#### 1.1. Deve cadastrar um novo filme com todos os campos preenchidos incluindo poster e destaque

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que nao existe filme com titulo 'Gerra Mundial Z' no banco de dados
    - expect: O estado inicial esta limpo para o teste
  2. Acessar http://localhost:3000/admin/login e autenticar com email 'admin@zombieplus.com' e senha 'pwd123'
    - expect: O sistema redireciona para /admin/movies apos login bem-sucedido
    - expect: A navegacao lateral exibe os menus: Filmes, Series de TV, Leads e Sair
  3. Clicar no botao de adicionar novo filme (icone de adicionar ao lado do campo de busca) para ir a pagina /admin/movies/register
    - expect: A pagina exibe o formulario com titulo 'Cadastrar novo Filme'
    - expect: Os campos Titulo do filme, Sinopse, Distribuido por, Ano de lancamento, Poster e Conteudo destaque? estao visiveis
    - expect: O botao 'Voltar' e o botao 'Cadastrar' estao presentes no cabecalho
  4. Preencher o campo 'Titulo do filme' com 'Gerra Mundial Z'
    - expect: O texto digitado aparece no campo sem erros
  5. Preencher o campo 'Sinopse' com 'Joel recebe a missao de escoltar Ellie atraves de um mundo devastado por uma infeccao fungica.'
    - expect: O texto digitado aparece no campo de sinopse
  6. Clicar no dropdown 'Distribuido por:' e selecionar a opcao 'Netflix'
    - expect: O dropdown exibe as 10 opcoes: Walt Disney Studios, Warner Bros. Pictures, Lionsgate Films, Fox Entertainment, Paramount Pictures, Netflix, Sony Pictures, Universal Pictures, Amazon Studios, Columbia Pictures
    - expect: Apos selecionar, o campo exibe 'Netflix'
  7. Clicar no dropdown 'Ano de lancamento:' e selecionar '2016'
    - expect: O dropdown exibe anos de 1970 a 2024 (55 opcoes)
    - expect: Apos selecionar, o campo exibe '2016'
  8. Clicar no botao 'Poster' e selecionar o arquivo de imagem 'tests/support/fixtures/covers/movies/wwz.png' no seletor de arquivos
    - expect: O nome do arquivo 'wwz.png' e exibido ao lado do botao 'Escolher arquivo' apos a selecao
  9. Clicar no toggle 'Conteudo destaque?' para ativa-lo
    - expect: O toggle muda para o estado ativado (checked)
  10. Clicar no botao 'Cadastrar'
    - expect: O sistema exibe o dialog 'Otima noticia!' com a mensagem: "O filme 'Gerra Mundial Z' foi adicionado ao catalogo."
    - expect: O botao 'Ok' esta presente no dialog
    - expect: O sistema redireciona para /admin/movies apos fechar o dialog
    - expect: O filme 'Gerra Mundial Z' aparece na tabela de filmes com as informacoes: Netflix, 2016

#### 1.2. Deve cadastrar um novo filme sem poster (poster e opcional)

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que nao existe filme com titulo 'Exterminador do Futuro Z' no banco de dados
    - expect: Estado inicial limpo
  2. Autenticar como admin em http://localhost:3000/admin/login com email 'admin@zombieplus.com' e senha 'pwd123'
    - expect: Redirecionamento para /admin/movies
  3. Navegar para /admin/movies/register
    - expect: Formulario de cadastro exibido
  4. Preencher 'Titulo do filme' com 'Exterminador do Futuro Z', 'Sinopse' com 'Um robô do futuro chega para acabar com os zumbis.', selecionar 'Sony Pictures' no dropdown 'Distribuido por:' e selecionar '2020' no dropdown 'Ano de lancamento:'. Deixar o campo Poster sem selecionar arquivo e deixar o toggle 'Conteudo destaque?' desligado
    - expect: Todos os campos obrigatorios estao preenchidos sem poster
  5. Clicar no botao 'Cadastrar'
    - expect: O dialog 'Otima noticia!' e exibido com a mensagem confirmando o cadastro do filme
    - expect: O sistema navega para /admin/movies
    - expect: O filme aparece na listagem sem imagem de capa

#### 1.3. Deve cadastrar um novo filme com toggle Conteudo destaque ativado

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que nao existe filme com titulo 'Zumbi Destaque' no banco de dados. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido com toggle 'Conteudo destaque?' no estado desligado por padrao
  2. Preencher todos os campos obrigatorios: Titulo 'Zumbi Destaque', Sinopse 'Filme de destaque.', Distribuidor 'Warner Bros. Pictures', Ano '2022'
    - expect: Campos preenchidos corretamente
  3. Clicar no toggle 'Conteudo destaque?' para ativa-lo e depois clicar em 'Cadastrar'
    - expect: O toggle fica no estado ativado (checked) apos o clique
    - expect: O dialog de sucesso e exibido
    - expect: O filme e cadastrado com a flag de destaque ativada

### 2. Validacao de Campos Obrigatorios

**Seed:** `tests/seed.spec.ts`

#### 2.1. Nao deve cadastrar quando nenhum campo obrigatorio e preenchido

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido sem mensagens de erro
  2. Sem preencher nenhum campo, clicar diretamente no botao 'Cadastrar'
    - expect: O sistema permanece na pagina /admin/movies/register
    - expect: Sao exibidas 4 mensagens 'Campo obrigatorio': abaixo do campo 'Titulo do filme', abaixo do campo 'Sinopse', abaixo do campo 'Distribuido por:' e abaixo do campo 'Ano de lancamento:'
    - expect: Os campos Poster e Conteudo destaque? nao exibem mensagem de erro
    - expect: Nenhum dialog de sucesso ou erro e exibido

#### 2.2. Nao deve cadastrar quando apenas o titulo esta preenchido

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Preencher apenas o campo 'Titulo do filme' com 'Filme Incompleto' e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina de cadastro
    - expect: Sao exibidas mensagens 'Campo obrigatorio' para Sinopse, Distribuido por e Ano de lancamento
    - expect: O campo Titulo do filme nao exibe mensagem de erro

#### 2.3. Nao deve cadastrar quando apenas a sinopse esta preenchida

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Preencher apenas o campo 'Sinopse' com 'Esta e a sinopse.' e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina de cadastro
    - expect: Sao exibidas mensagens 'Campo obrigatorio' para Titulo do filme, Distribuido por e Ano de lancamento
    - expect: O campo Sinopse nao exibe mensagem de erro

#### 2.4. Nao deve cadastrar quando apenas o distribuidor esta selecionado

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Selecionar apenas 'Sony Pictures' no dropdown 'Distribuido por:' e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina de cadastro
    - expect: Sao exibidas mensagens 'Campo obrigatorio' para Titulo do filme, Sinopse e Ano de lancamento
    - expect: O campo Distribuido por nao exibe mensagem de erro

#### 2.5. Nao deve cadastrar quando apenas o ano de lancamento esta selecionado

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Selecionar apenas '2010' no dropdown 'Ano de lancamento:' e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina de cadastro
    - expect: Sao exibidas mensagens 'Campo obrigatorio' para Titulo do filme, Sinopse e Distribuido por
    - expect: O campo Ano de lancamento nao exibe mensagem de erro

#### 2.6. Nao deve cadastrar quando titulo e sinopse estao preenchidos mas dropdowns nao estao selecionados

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Preencher 'Titulo do filme' com 'Filme Sem Distribuidor' e 'Sinopse' com 'Sinopse qualquer.' sem selecionar os dropdowns, e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina de cadastro
    - expect: Sao exibidas mensagens 'Campo obrigatorio' para os dois dropdowns (Distribuido por e Ano de lancamento)
    - expect: Os campos de texto nao exibem mensagem de erro

### 3. Titulo Duplicado

**Seed:** `tests/seed.spec.ts`

#### 3.1. Nao deve cadastrar um filme com titulo ja existente no catalogo

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que existe um filme com titulo 'Apocalipse' ja cadastrado no banco de dados (via API ou banco direto)
    - expect: Filme 'Apocalipse' esta listado em /admin/movies
  2. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario de cadastro exibido
  3. Preencher 'Titulo do filme' com 'Apocalipse', 'Sinopse' com 'Sinopse diferente para duplicado.', selecionar 'Amazon Studios' e ano '2017', e clicar em 'Cadastrar'
    - expect: O sistema permanece na pagina /admin/movies/register
    - expect: O dialog 'Atencao!' e exibido com a mensagem: "O titulo 'Apocalipse' ja consta em nosso catalogo. Por favor, verifique se ha necessidade de atualizacoes ou correcoes para este item."
    - expect: O botao 'Ok' esta presente no dialog
    - expect: O catalogo nao recebe um novo registro duplicado
  4. Clicar em 'Ok' para fechar o dialog de erro
    - expect: O dialog fecha e o formulario permanece preenchido com os dados anteriores
    - expect: O usuario permanece na pagina de cadastro podendo corrigir o titulo

#### 3.2. Deve permitir cadastrar apos corrigir um titulo duplicado

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que existe 'Apocalipse' no catalogo e que nao existe 'Apocalipse - Versao Remasterizada'. Autenticar como admin, navegar para /admin/movies/register e tentar cadastrar com titulo 'Apocalipse' (titulo duplicado)
    - expect: O dialog de erro 'Atencao!' e exibido
  2. Clicar em 'Ok' para fechar o dialog de duplicidade
    - expect: O formulario e exibido com os campos ainda preenchidos
  3. Limpar o campo 'Titulo do filme' e digitar 'Apocalipse - Versao Remasterizada', mantendo os demais campos preenchidos, e clicar em 'Cadastrar'
    - expect: O dialog 'Otima noticia!' e exibido confirmando o cadastro com o novo titulo
    - expect: O filme e adicionado ao catalogo com o titulo corrigido

### 4. Upload de Imagem de Poster

**Seed:** `tests/seed.spec.ts`

#### 4.1. Deve exibir o nome do arquivo apos selecionar uma imagem de poster

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: O campo Poster exibe o botao 'Poster' (ou 'Escolher arquivo') sem nenhum arquivo selecionado
  2. Clicar no botao 'Poster' e selecionar o arquivo 'tests/support/fixtures/covers/movies/resident-evil.jpg' no seletor de arquivos do sistema
    - expect: O seletor de arquivos e aberto ao clicar no botao
    - expect: Apos selecionar, o nome do arquivo 'resident-evil.jpg' e exibido ao lado do botao 'Escolher arquivo'
    - expect: O botao fica com estado 'active'

#### 4.2. Deve cadastrar filme com poster e verificar a imagem na listagem

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que nao existe filme com titulo 'Zumbi com Poster' no banco. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario de cadastro exibido
  2. Preencher todos os campos: Titulo 'Zumbi com Poster', Sinopse 'Filme com capa.', Distribuidor 'Universal Pictures', Ano '2019', e fazer upload do arquivo 'tests/support/fixtures/covers/movies/mortos-vivos.jpg' como poster
    - expect: Todos os campos preenchidos e nome do arquivo exibido
  3. Clicar em 'Cadastrar'
    - expect: O dialog de sucesso e exibido
    - expect: Na listagem de filmes, o registro 'Zumbi com Poster' exibe uma imagem de capa na coluna de poster

#### 4.3. Deve permitir abrir o seletor de arquivos cancelar sem selecionar e continuar o cadastro

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Clicar no botao 'Poster' para abrir o seletor de arquivos e cancelar a selecao sem escolher nenhum arquivo
    - expect: O seletor de arquivos e aberto
    - expect: Apos cancelar, o campo Poster nao exibe nenhum nome de arquivo
    - expect: O formulario permanece editavel
  3. Preencher todos os campos obrigatorios (Titulo: 'Zumbi Sem Capa', Sinopse: 'Sem imagem.', Distribuidor: 'Fox Entertainment', Ano: '2015') e clicar em 'Cadastrar'
    - expect: O cadastro e realizado com sucesso mesmo sem poster
    - expect: O dialog 'Otima noticia!' e exibido

### 5. Dropdowns de Distribuidor e Ano de Lancamento

**Seed:** `tests/seed.spec.ts`

#### 5.1. Deve filtrar opcoes do dropdown de distribuidor ao digitar um termo de busca

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario exibido
  2. Clicar no dropdown 'Distribuido por:' para abri-lo
    - expect: O dropdown exibe todas as 10 opcoes de distribuidoras
  3. Digitar 'Net' no campo de busca do dropdown
    - expect: O dropdown filtra e exibe apenas 'Netflix' como resultado
    - expect: As demais opcoes sao ocultadas
  4. Limpar o campo e digitar 'Sony'
    - expect: O dropdown exibe apenas 'Sony Pictures'
  5. Clicar em 'Sony Pictures' para selecionar
    - expect: O campo exibe 'Sony Pictures' como valor selecionado
    - expect: O dropdown fecha

#### 5.2. Deve exibir 'Nenhum registro encontrado' ao buscar termo inexistente no dropdown de distribuidor

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register. Clicar no dropdown 'Distribuido por:' para abri-lo
    - expect: Dropdown aberto com todas as 10 opcoes
  2. Digitar 'xyzabc' no campo de busca do dropdown
    - expect: O dropdown exibe a mensagem 'Nenhum registro encontrado'
    - expect: Nenhuma opcao de distribuidora e listada

#### 5.3. Deve exibir o intervalo correto de anos no dropdown de ano de lancamento (1970 a 2024)

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register. Clicar no dropdown 'Ano de lancamento:' para abri-lo
    - expect: O dropdown abre exibindo a lista de anos
    - expect: O primeiro ano disponivel e '1970'
    - expect: O ultimo ano disponivel e '2024'
    - expect: Ha exatamente 55 opcoes disponiveis
  2. Selecionar o ano '1970' (primeiro da lista)
    - expect: O campo exibe '1970' como valor selecionado

#### 5.4. Deve selecionar o ano mais recente disponivel no dropdown (2024)

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register. Clicar no dropdown 'Ano de lancamento:' e rolar ate o fim da lista
    - expect: O ultimo ano disponivel e '2024'
  2. Selecionar '2024'
    - expect: O campo exibe '2024' como valor selecionado

#### 5.5. Deve fechar o dropdown ao pressionar Escape

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register. Clicar no dropdown 'Distribuido por:' para abri-lo
    - expect: O dropdown abre com as opcoes visiveis
  2. Pressionar a tecla Escape
    - expect: O dropdown fecha sem selecionar nenhuma opcao
    - expect: O campo continua exibindo 'Selecione...'

### 6. Navegacao e Interface

**Seed:** `tests/seed.spec.ts`

#### 6.1. Deve navegar de volta a listagem de filmes ao clicar em Voltar

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: Formulario de cadastro exibido com o botao 'Voltar' no cabecalho
  2. Clicar no botao 'Voltar'
    - expect: O sistema navega para /admin/movies
    - expect: A listagem de filmes e exibida
    - expect: Nenhum dado digitado foi salvo

#### 6.2. Deve acessar o formulario de cadastro a partir do icone de adicionar na listagem

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin, navegar para /admin/movies
    - expect: A listagem de filmes e exibida com o icone de adicionar novo filme
  2. Clicar no icone de adicionar novo filme (link /admin/movies/register)
    - expect: O sistema navega para /admin/movies/register
    - expect: O formulario 'Cadastrar novo Filme' e exibido

#### 6.3. Deve exibir o formulario de cadastro com todos os campos no estado inicial correto

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Autenticar como admin e navegar para /admin/movies/register
    - expect: O campo 'Titulo do filme' esta vazio com placeholder 'Digite aqui'
    - expect: O campo 'Sinopse' esta vazio com placeholder 'Digite aqui'
    - expect: O dropdown 'Distribuido por:' exibe 'Selecione...'
    - expect: O dropdown 'Ano de lancamento:' exibe 'Selecione...'
    - expect: O botao Poster nao exibe nenhum arquivo selecionado
    - expect: O toggle 'Conteudo destaque?' esta desligado (nao marcado)
    - expect: Nenhuma mensagem de erro esta visivel

#### 6.4. Deve fechar o dialog de sucesso ao clicar em Ok e permanecer na listagem

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que nao existe 'Filme Dialog Test' no banco. Autenticar como admin, navegar para /admin/movies/register e cadastrar um novo filme valido com titulo 'Filme Dialog Test'
    - expect: O dialog 'Otima noticia!' e exibido com a mensagem de confirmacao e botao 'Ok'
  2. Clicar no botao 'Ok' do dialog de sucesso
    - expect: O dialog fecha
    - expect: O usuario permanece em /admin/movies (listagem)
    - expect: O filme recem cadastrado aparece na tabela

#### 6.5. Deve fechar o dialog de erro de duplicidade ao clicar em Ok

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que 'Apocalipse' existe no catalogo. Autenticar como admin, navegar para /admin/movies/register e tentar cadastrar um filme com titulo 'Apocalipse' preenchendo todos os outros campos obrigatorios
    - expect: O dialog 'Atencao!' e exibido com a mensagem de titulo duplicado
  2. Clicar no botao 'Ok' do dialog de erro
    - expect: O dialog fecha
    - expect: O usuario permanece na pagina /admin/movies/register
    - expect: O formulario ainda esta preenchido com os dados anteriores para possivel correcao

### 7. Remocao de Filme

**Seed:** `tests/seed.spec.ts`

#### 7.1. Deve remover um filme do catalogo apos confirmar a exclusao

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que existe um filme com titulo 'Madrugada dos Mortos' cadastrado no catalogo (via API ou banco)
    - expect: O filme 'Madrugada dos Mortos' aparece na listagem /admin/movies
  2. Autenticar como admin e navegar para /admin/movies
    - expect: A listagem de filmes e exibida com o botao de exclusao em cada linha
  3. Localizar a linha do filme 'Madrugada dos Mortos' e clicar no botao de exclusao (icone de lixeira/remocao)
    - expect: Um tooltip de confirmacao aparece com o texto 'Clique aqui para confirmar a exclusao!'
  4. Clicar no tooltip de confirmacao 'Clique aqui para confirmar a exclusao!' (elemento com classe confirm-removal)
    - expect: O dialog 'Tudo certo!' e exibido com a mensagem: 'Filme removido com sucesso.'
    - expect: O botao 'Ok' esta disponivel no dialog
  5. Clicar em 'Ok' para fechar o dialog de sucesso
    - expect: O dialog fecha
    - expect: O filme 'Madrugada dos Mortos' nao aparece mais na listagem de filmes

#### 7.2. Nao deve remover o filme ao ignorar o tooltip de confirmacao

**File:** `tests/e2e/movies.spec.js`

**Steps:**
  1. Garantir que existe um filme cadastrado para teste. Autenticar como admin e navegar para /admin/movies
    - expect: Listagem exibida com o botao de remocao em cada linha
  2. Clicar no botao de exclusao de um filme para acionar o tooltip de confirmacao
    - expect: O tooltip 'Clique aqui para confirmar a exclusao!' aparece
  3. Clicar em qualquer area fora do tooltip para fechar sem confirmar
    - expect: O tooltip fecha sem executar a exclusao
    - expect: O filme permanece na listagem
