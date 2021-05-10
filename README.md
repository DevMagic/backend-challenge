# Challenge - Developer Backend

O desafio é construir uma API Rest que seja capaz de cadastrar, buscar, atualizar e apagar os jogadores. Ela deverá ser capaz de consultar a Api da Riot Games para trazer os dados dos jogadores que serão cadastrados em uma base de dados.

<br>

## Tecnologias utilizadas

* NestJS
* PostgreSQL
* Typescript
* TypeORM

<br>

## Configurar variáveis de ambiente

<p>Altere conforme necessidade as variáveis no arquivo .env, localizado na raiz do projeto</p>
<p>Não se esqueça de colocar a KEY para acessar a API da riot e as configurações do banco</p>

```
TYPEORM_CONNECTION=postgres               # O banco de dados utilizado
TYPEORM_HOST=localhost                    # Host do banco
TYPEORM_DATABASE=                         # O nome do database
TYPEORM_USERNAME=                         # Username do banco
TYPEORM_PASSWORD=                         # Senha para acessar o banco
TYPEORM_PORT=5432                         # Porta em que o banco está rodando

RIOT_API=https://br1.api.riotgames.com    # O HOST da riot escolhido
RIOT_KEY=                                 # Sua KEY para utilizar a API da riot  
```

<br>

## Instalando as dependencias
<p>Utilize o gerenciador de pacotes de sua preferência para instalar as dependências, como o yarn ou npm</p>
<p>Certifique-se de rodar os comandos na raiz do projeto</p>

```
yarn
npm install
```

<br>

## Rodando as Migrations

```
yarn typeorm migration:run
npm run typeorm migration:run
```

<br>

## Iniciando a aplicação

```
yarn run start
npm run start
```

<br>

## Descrição das rotas

***GET*** /summoner
<p>Lista todos os summoners cadastrados no banco de dados</p>

***RESPONSE*** <br>
***STATUS CODE 200***

```Json
[
    {
        "id": 1,
        "nickname": "Old Wolf King",
        "accountId": "4nMqcryY2_i_x44wVLk6xfg5VsyofUNTE43KUlwVj6YyIyA",
        "summonerLevel": 235,
        "profileIconId": 4244,
        "summonerId": "SslHLNxNxQpMJcdu-qUz4fl5qP_paj2WvFG7SFCLxWxpU2Q"
    }
]
```

<br>

***GET*** /summoner/details
<p>Lista todos os summoners cadastrados com wins e losses</p>

***RESPONSE***  <br>
***STATUS CODE 200***

```Json
[
    {
        "id": 1,
        "nickname": "Old Wolf King",
        "accountId": "4nMqcryY2_i_x44wVLk6xfg5VsyofUNTE43KUlwVj6YyIyA",
        "summonerLevel": 235,
        "profileIconId": 4244,
        "summonerId": "SslHLNxNxQpMJcdu-qUz4fl5qP_paj2WvFG7SFCLxWxpU2Q",
        "wins": 38,
        "losses": 32
    }
]
```

<br>

***POST*** /summoner
<p>Cadastra um summoner com os dados recebidos da riot</p>

***BODY***

```Json
{
	"summonerName":"OldWolfKing"
}
```

***RESPONSE***  <br>
***STATUS CODE 201***

```Json
[
    {
        "id": 1,
        "nickname": "Old Wolf King",
        "accountId": "4nMqcryY2_i_x44wVLk6xfg5VsyofUNTE43KUlwVj6YyIyA",
        "summonerLevel": 235,
        "profileIconId": 4244,
        "summonerId": "SslHLNxNxQpMJcdu-qUz4fl5qP_paj2WvFG7SFCLxWxpU2Q"
    }
]
```

<br>

***PUT*** /summoner/:id
<p>Atualiza o summonerName e summonerLevel pelo ID</p>

***BODY***

```Json
{
	"summonerName":"Elder Wolf King",
    "summonerLevel": 586
}
```

***RESPONSE***  <br>
***STATUS CODE 200***

```Json
[
    {
        "id": 1,
        "nickname": "Elder Wolf King",
        "accountId": "4nMqcryY2_i_x44wVLk6xfg5VsyofUNTE43KUlwVj6YyIyA",
        "summonerLevel": 586,
        "profileIconId": 4244,
        "summonerId": "SslHLNxNxQpMJcdu-qUz4fl5qP_paj2WvFG7SFCLxWxpU2Q"
    }
]
```

<br>

***DELETE*** /summoner/:id
<p>Deleta um jogador pelo ID</p>

***RESPONSE*** <br>
***STATUS CODE 200***

```Json
{
    "message": "successfully deleted"
}
```
