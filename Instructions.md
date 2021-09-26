# Challenge - Developer Backend - Ivanilson Santos

Aqui contêm as instruções para os acessos aos endponts dessa API.

## Tecnologias Usadas

- Nodejs.
- MongoDB, utilizando o seu serviço na nuvem, o Atlas.
- Framework ExpressJS para o tratamento das rotas.
- Bibliotca Mongoose para a estruturação de objeto do MongoDB.

##

### Rotas

#### Cadastro do Usuário

- POST: /user/register/

_Body_

```javascript
{
  "name": "gabriel",
  "email": "gabriel@gabriel.com",
  "password": "1213141516"
}
```

#### Login do Usuário

- POST: /user/login/

_Body_

```javascript
{
  "name": "gabriel",
  "email": "gabriel@gabriel.com",
  "password": "1213141516"
}
```

#### Cadastro do Summoner

- POST: /summoner/register/

_Body_

```javascript
{
    "summonerName":"Old Wolf King"
}
```

#### Buscar todos os Summoners

- GET: /summoner/

#### Buscar todos os Summoners detalhadamente

- GET: /summoner/detailed/:nickname/:summonerLevelMin/:summonerLevelMax/:winsMin/:winsMax/:lossesMin/:lossesMax/

- OBS: É feito um filtro por vez, ou seja, só pode ser filtrado ou por nome ou por level, assim por diante, nunca dois ao mesmo tempo. Para os filtros numéricos, deve ser colocado tanto o mínimo quanto o máximo, e o resto dos campos deve ser colocado um '@'. Se for colocado o '@' em todo os parâmetros, o response será com todos os usuários. O Campo nome pode ser buscado com partes da string. Um exemplo de como deve ficar o endpoit: /summoner/detailed/@/@/@/10/50/@/@/

#### Deletar Summoner

- DELETE: /summoner/

- OBS: Só poderá ser deletado com o token que foi gerado pelo usuário que criou o summoner.

_Body_

```javascript
{
    "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
}
```


#### Atualizar Summoner

- PUT: /summoner/

OBS: Só poderá ser atualizado com o token que foi gerado pelo usuário que criou o summoner.

_Body_

```javascript
{
    "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
}
```

#### Gerar XLSX de todos os Summoners

- POST: /summoner/xlsx/


##### OBS

- Para iniciar o projeto, antes de tudo, deve se executar o comando "npm install" na raiz do projeto para instalar todas as dependências necessárias, após isso, deve ser executado o comando "node server.js". Com o servidor sendo executando, api pode ser acessada com o localhost:3000.
- O bearer token expira depois de 10 horas que o usuário realizou o Login, podendo esse tempo ser alterado no userControler.js.
- O usuário "Praymer" não consta na base de dados do League of Legends.
- É necessário criar um banco de dados no MongoDB Atlas, passando as suas credencias nas váriaveis de ambiente
- As várias de ambiente necessárias para acessar o projeto são:
    
    - LOL_KEY (chave da API do LoL)
    - DB_PASSWORD
    - DB_USER
    - DB_CLUSTER (caso tenham dúvidas, é possível gerar a string de conexão no próprio MongoDB Atlas, assim, dentro da string, o cluster fica entre a senha e o nome o banco de dados)
    - JWT_KEY (chave para aumentar a criptografia do Json Web Token)

- É necessário atualizar a chave da API do League of Legends, pois ela expira em 24 horas.


