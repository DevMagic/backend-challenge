# Challenge - Developer Backend | DevMagic |

O desafio é construir uma API Rest que seja capaz de cadastrar, buscar, atualizar e apagar os jogadores. 
Ela deverá ser capaz de consultar a Api da Riot Games para trazer os dados dos jogadores que serão cadastrados em uma base de dados.

## Instalação

Use o gerenciador de pacotes [yarn](https://yarnpkg.com/getting-started/install) ou [npm](https://www.npmjs.com/get-npm) para instalar todas dependencias.

Abra o projeto na pasta raiz e execute os comandos.

### yarn

```bash
yarn
```

### npm

```bash
npm install
```

### Docker

Assim que o comando for executado o docker compose criará containers previamente configurados.

```bash
docker-compose up -d

```
## Aplicação

Para verificar se tudo está ocorrendo normalmente pode executar o seguinte comando: 

```bash
docker logs summonerapi -f

```
### Acessar Documentação ( Imagem 1.2 )

#### Contém todo o fluxo da aplicação configurado para realizar os testes

Basta entrar em um navegador de sua preferência e acessar a seguinte rota:

```bash
http://localhost:3333/api-docs/

```
### Executar testes unitários e de integração ( Imagem 1.1 )

#### Crie uma nova base de dados dentro do container "database_summoner"

"Você pode usar um gerenciador de banco de dados" (ex: beekeeper studio)

```sql
create database summonerdb_test

```

#### Executar os testes com o seguinte comando:

```bash
yarn test

```

#### ou

```bash
npm run test

```

## Observações

### Testes unitários

Os testes unitários são feitos utilizando armazenamento em mémoria.

### Testes de integração

Outra base de dados foi criada para não fazer os testes de integração em uma base de dados que seria em produção, assim criando uma de teste.

### Testando aplicação com swagger

Toda configuração foi feita com swagger para possibilitar testar os endpoints da aplicação de uma forma mais fácil e visual, com todas as explicações necessárias em cada uma.

### API KEY

Provavelmente a "API KEY" vai estar expirada, você pode gerar uma através da sua conta na RIOT e modificar nos arquivos:

```bash
.env
./src/config/jestSetup.ts
```

" Estes dois arquivos somente foram upados para o github para não gerar complicações quando a aplicação estiver em teste"

## Anexos

### 1.1 Testes - Unitários e Integração

<img height="350em" src="https://lh5.googleusercontent.com/2h7-9cbnTXkqwBkbdgyzJ9dQY985cmMNLovgiQnSS2Ge9_UiBKSi9WUdZXqL77foyuuBvrtwZqq09HPuP2gu=w1920-h976-rw" />

### 1.2 Swagger (Interface)

<img height="350em" src="https://lh3.googleusercontent.com/PrzOS0lHTAJAS6xpCDOVBLuKE0XVdkPEwt4SC0rAxu7IAgm8imI_3oMBwXKlYF7Yb92mMAV4WtA-KFggInpt=w1920-h976-rw" />

## Principais dependências

- [Typescript](https://www.typescriptlang.org/) - TypeScript é um superconjunto de JavaScript desenvolvido pela Microsoft que adiciona tipagem e alguns outros recursos a linguagem
- [Node.js](https://nodejs.org/en/) - Node.js é um software de código aberto, multiplataforma, que executa códigos JavaScript no backend
- [Express](https://expressjs.com/) - Express.js é um framework para otimizar a construção de aplicações web e API's.
- [Axios](https://github.com/axios/axios) - Axios é um cliente HTTP baseado em Promises para fazer requisições.
- [Docker](https://www.docker.com/) - Docker é um conjunto de produtos de plataforma como serviço que usam virtualização de nível de sistema operacional para entregar software em pacotes chamados contêineres.
- [TypeORM](https://typeorm.io/) - TypeORM é um ORM (Mapeamento objeto-relacional) que ajuda desenvolver qualquer tipo de aplicativo que use bancos de dados.
- [Jest](https://jestjs.io) - Jest é uma estrutura de teste de JavaScript mantida pelo Facebook.
- [ESlint](https://eslint.org/) - O ESLint analisa estaticamente seu código para encontrar problemas rapidamente.
- [Prettier](https://prettier.io/) - Um formatador de código opinativo.





