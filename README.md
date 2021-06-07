# Projeto League of Legends

Gostaria de agradecer a oportunidade de participar desse desafio que particularmente adorei, tive a oportunidade de fazer um projeto robusto usando muito do que sei, espero atender as expectativas.

Esse projeto tem como objetivo o desenvolvimento de um CRUD.

## Arquitetura

O projeto é composto por:
- Uma aplicação back-end:
	Pode criar summoners se o nome for encontrado na API da riot, listar todos os summoners salvos, editar, deletar e exibir informações detalhadas.
	
	Utiliza as tecnologias:
	- Node Js
	- Express
	- Docker
	- PostgreSQL
	- Swagger

## Como montar o ambiente para utilização com Docker

Para montar o projeto em sua maquina é necessário ter instalado:

- [PostgreSQL](https://www.postgresql.org/ "postgresql")
- [Node](https://nodejs.org/ "node")
- [Docker](https://www.docker.com/ "docker")

Note que para utilizar a API é necessário entrar com informações do banco de dados, basta acessar o arquivo .env encontrado na raiz do projeto.

Para a utilização do docker recomendo que o .env esteja preenchido da seguinte forma:

DB_USER=postgres
DB_PASSWORD=123
DB_HOST=db
DB_DATABASE=TesteDevMagic

API_KEY= "Este campo deve ser alterado de acordo com a API_KEY da riot no momento"

SLEEP_TIME=2000


Com tudo instalado e configurado, abra o terminal do seu sistema operacional na pasta do projeto e digite:
```shell
	docker build -t node-back .
```
Esse comando cria a imagem do back-end que será utilizada pelo docker compose.

Após isso basta digitar o seguinte comando:
```shell
	docker-compose up
```
Apartir dai tudo deve estar funcionando basta acessar a localhost:3000/doc para ter acesso ao Swagger e começar a testar.

PS: Sempre que alguma configuração do .env for feita é nescessário e criação de uma nova imagem para o docker, basta usar o comando:
```shell
	docker image rm node-back
```
E em seguida basta criar a nova imagem com o comando:
```shell
	docker build -t node-back .
```

## Como montar o ambiente para utilização sem Docker

Alternativamente o projeto também pode ser executado sem o docker:

Basta configurar o arquivo .env com as informações do seu banco de dados, não esquecendo de checar se a API_KEY esta valida.

Em seguida abra o terminal do seu sistema operacional na pasta do projeto e digite:
```shell
	npm install
```
Após o node modules terminar sua instalação simplesmente digite:
```shell
	npm start
```
A rota localhost:3000/doc esta disponível para o uso com o Swagger.


## Rotas

/criar : Recebe um json no padrão:

	{
		"summonerName":"NickDoSummoner"
	}

Procura o nick na api da Riot e retorn um json com as informações obtidas.


/listarSummoners : Retorna todos os Summoners cadastrados na base de dados.

/infoSummoners : Usa o summonerId para trazer mais informações da api da riot como numero de vitórias e derrotas. Essa rota pode apresentar lentidões devido ao numero limitado de request que podem ser feitas para a API da riot.

/atualizarSummoner/:id : Atualiza o summonerName e o lvl, recebe o id do summoner por url e do body um padrão:
		
	{
  		"summonerName":"NovoNick",
  		"summonerLevel": 100
	}

/deletarSummoner/:id : Deleta um summoner através do id passado por url