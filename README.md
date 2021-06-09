<img src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend

O desafio é construir uma API Rest que seja capaz de cadastrar, buscar, atualizar e apagar os jogadores. Ela deverá ser capaz de consultar a <a href='https://developer.riotgames.com/'>Api da Riot Games</a> para trazer os dados dos jogadores que serão cadastrados em uma base de dados.

Lista dos jogadores a serem cadastrados:

- OldWolfKing
- Praymer
- ThrekSor
- AndrewDiass
- BiliBoss
- DartSecond
- Devils Advocate
- Gabrvxo
- theKovac
- zRabelo

<br>

## <a href='https://developer.riotgames.com/'>API League of Legends</a>

<br>

Para consumir a API é necessário criar uma conta na plataforma e ler a documentação. Os endpoints que serão usados nesse projeto requerem autenticação e é possivel gerar um token com tempo de expiração para poder estar consumindo esse serviço.

## Challenge Accepted</a>

Deve ser construido a tabela Summoner no banco de dados com essas colunas

| Id  | Nickname      | AccountId       | SummonerLevel | ProfileIconId | SummonerId         | userId             |
| --- | ------------- | --------------- | ------------- | ------------- | ------------------ | ------------------ |
| 1   | Old Wolf King | V94KgBnbbsaR4I4 | 100           | 4864          | OtaV_QBRbtzt7DtpZn | 1                  |
| 2   | Wolf Old King | bsaR4I4V94KgBnb | 150           | 4684          | FtaZ_QBRbtzt7DtpZn | 2                  |
| 3   | King Old Wolf | 4I4V94KgbsaRBnb | 500           | 4648          | GtaT_QBRbtzt7DtpZn | 3                  |

<br>

_O ID do pode ser tanto UUID ou numérico incremental_
* userId => chave estrangeira com o "id" da tabela User
* accountId => unique
* summonerId => unique
* nickname => obrigatorio preencher

<br>

Deve ser construido a tabela User no banco de dados com essas colunas

| Id  | Name          | Email                        | Password                                     | 
| --- | ------------- | ---------------------------- | -------------------------------------------- |
| 1   | Gabriel       | laurencioX.arkauss@gmail.com | 6RdShg1qV2ZAp9LJJKeIcCDhatpEXiBdKCnK41AX7ws= |

<br>

_O ID do pode ser tanto UUID ou numérico incremental_
* id => chave estrangeira com o "userId" da tabela Summoner
* email => unique
* name => obrigatorio preencher
* password => obrigatorio preencher

<br>

### **CRIAR USUÁRIO**

<br>

Deve possuir uma rota **POST** para cadastrar um USUÁRIO, deverá receber os seguintes dados no corpo da requisição:

_Body_

```javascript
{
  "name": "gabriel",
  "email": "gabriel@gabriel.com",
  "password": "1213141516",
}
```

<br>

### **Response**

<br>

> Status Code 201

```javascript
{
    "id": "OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM",
    "name":"gabriel",
    "email":"gabriel@gabriel.com",
    "password":"6RdShg1qV2ZAp9LJJKeIcCDhatpEXiBdKCnK41AX7ws=",
}
```

### **LOGIN**

<br>

Deve possuir uma rota **POST** para retorna um token de acesso que expira em 24h, com esse token deve ser possivel acessar os endpoints a seguir:

_Body_

```javascript
{
  "name": "gabriel",
  "email": "gabriel@gabriel.com",
  "password": "1213141516",
}
```

<br>

### **Response**

<br>

> Status Code 200

```javascript
{    
    "token":"6RdShg1qV2ZApeIcCDhatpEXiBdKCnK41AX79LJJKeIcCDhatpEXiBdKCnK41AX7ws="
}
```

### **CRIAR SUMMONER**

<br>

*Para consumir essa rota é necessario enviar um bearer token valido, e o userId vai ser consumido do token.*

Deve possuir uma rota **POST** para cadastrar um SUMMONER, deverá receber os seguintes dados no corpo da requisição:

_Body_

```javascript
{
	"summonerName":"OldWolfKing"
}
```

A rota deve consumir o **SummonerName** do corpo e usar para consultar no end point abaixo da API riotgames as informações _AccountId_, _SummonerLevel_, _ProfileIconId_ e _Id_.

<br>

```javascript
/lol/summoner/v4/summoners/by-name/{summonerName}?api_key={token}
```

### **Response da API da RIOT**


```javascript
{
    "id": "OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM",
    "accountId": "V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw",
    "puuid": "5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q",
    "name": "Old Wolf King",
    "profileIconId": 4864,
    "revisionDate": 1613316510000,
    "summonerLevel": 225
}
```

E com esses dados fazer o cadastro do jogador no banco de dados.

<br>

### **LISTAR JOGADORES**

*Para consumir essa rota é necessario enviar um bearer token valido.*

<br>

Deve possuir uma rota **GET** para listar as informações da tabela **Summoner**, modelo esperado do retorno abaixo:

### **Response**

<br>

> Status Code 200

```javascript
[
  {
    id: "1",
    nickname: "Old Wolf King",
    accountId: "V94KgBnbbsaR4I4",
    summonerLevel: "100",
    profileIconId: "4864",
    summonerId: "V94KgBnbbsaR4I4",
  },
  {
    id: "2",
    nickname: "Old Wolf King",
    accountId: "bsaR4I4V94KgBnb",
    summonerLevel: "150",
    profileIconId: "4684",
    summonerId: "V94KgBnbbsaR4I4",
  },
  {
    id: "3",
    nickname: "Old Wolf King",
    accountId: "4I4V94KgbsaRBnb",
    summonerLevel: "500",
    profileIconId: "4648",
    summonerId: "V94KgBnbbsaR4I4",
  },
];
```

### **LISTAR INFORMAÇÕES DETALHADAS DOS JOGADORES**

*Para consumir essa rota é necessario enviar um bearer token valido.*

<br>

Deve possuir uma rota **GET** que ira além de trazer as informações da tabela ira trazer as quantidades de vitorias e derrotas de cada jogador, e deve ser possivel passar alguns campos para filtrar o resultado retornado:

### **Query**
<br>
* Nickname	
* SummonerLevel
* Vitorias
* Derrotas

### **Response**

<br>

> Status Code 200

```javascript
[
  {
    id: "1",
    nickname: "Old Wolf King",
    accountId: "V94KgBnbbsaR4I4",
    summonerLevel: "100",
    profileIconId: "4864",
    summonerId: "V94KgBnbbsaR4I4",
    wins: 2,
    losses: 100,
  },
  {
    id: "2",
    nickname: "Old Wolf King",
    accountId: "bsaR4I4V94KgBnb",
    summonerLevel: "150",
    profileIconId: "4684",
    summonerId: "V94KgBnbbsaR4I4",
    wins: 12,
    losses: 3,
  },
  {
    id: "3",
    nickname: "Old Wolf King",
    accountId: "4I4V94KgbsaRBnb",
    summonerLevel: "500",
    profileIconId: "4648",
    summonerId: "V94KgBnbbsaR4I4",
    wins: 7,
    losses: 7,
  },
];
```

Para trazer essas informações, consuma o endpoint da riotgames abaixo, ele retorna um array de objetos com os dados de um jogador com base no **encryptedSummonerId** enviado e cada objeto possui as propriedades _wins_ e _losses_:

```javascript
/lol/league/v4/entries/by-summoner/{encryptedSummonerId}?api_key={token}
```

_response_

```javascript
[
  {
    leagueId: "469c392c-063c-XXbca8-6c4c7c4d21d4",
    queueType: "RANKED_SOLO_5x5",
    tier: "SILVER",
    rank: "I",
    summonerId: "OtaV_QBRbtzt7DtpZnLXXXbvRjuDmDRZJ38wjbEQOqXbM",
    summonerName: "Old Wolf King",
    leaguePoints: 39,
    wins: 12,
    losses: 3,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
  },
  {
    leagueId: "0f276adb-9984-XXfdc-7d5fc5fc35d5",
    queueType: "RANKED_FLEX_SR",
    tier: "SILVER",
    rank: "I",
    summonerId: "OtaV_QBRbtzt7DtpZXXbvRjuDmDRZJ38wjbEQOqXbM",
    summonerName: "Old Wolf King",
    leaguePoints: 8,
    wins: 7,
    losses: 6,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
  },
];
```

Deve ser feito a somatória das vitórias e derrotas de cada objeto do array, lembrando que deve ser executado para cada jogador da tabela.

### **ATUALIZAR JOGADOR**

*Para consumir essa rota é necessario enviar um bearer token valido.*

<br>

Deve possuir uma rota *PUT* para atualizar somente o **summonerName** e **summonerLevel** do jogador através do ID:

_Body_

```javascript
{
  "summonerName":"OldWolfKingMaster",
  "summonerLevel": 550
}
```

### **Response**

<br>

> Status Code 200

```javascript
{
    "id": "OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM",
    "accountId": "V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw",
    "puuid": "5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q",
    "name": "OldWolfKingMaster",
    "profileIconId": 4864,
    "revisionDate": 1613316510000,
    "summonerLevel": 550
}
```

### **APAGAR JOGADOR**

*Para consumir essa rota é necessario enviar um bearer token valido.*

<br>

Deve possuir uma rota *DELETE* para apagar o jogador através do ID:

### **Response**

<br>

> Status Code 200

```javascript
{
    "message": "successfully deleted"
}
```

### **EXPORTAR JOGADORES**

*Para consumir essa rota é necessario enviar um bearer token valido.*

<br>

Deve possuir uma rota _POST_ que gera uma XLSX com todos os summoners cadastrados no banco de dados, com as quantidades de vitorias e derrotas.


## Requisitos

* API deve ser desenvolvida em NodeJs;
* Deve ser implementado testes que garantam que todas as rotas da API estejam funcionando
* As rotas que manipulam a tabela Summoner deve ser necessario passar um token de autenticação


## Avaliação

Você será avaliado pela usabilidade, por respeitar o design e pela arquitetura da API.

* Uso do Git
* Arquitetura da API
* Diferencial: NestJS ou Postgres
* A qualidade do código
* As decisões que você fez para resolver o desafio
* Tratamento de erros

## *Como participar?*

- Farça um fork deste repositório;
- Clone seu fork na sua máquina;
- Crie um novo branch com o seguinte padrão "challenge/seu-nome";
- Resolva o desafio;
- Faça uma PR para este repositório com instruções claras de como executar seu código.

Sua PR será avaliada e lhe daremos um feedback o mais rápido possível.


## FAQ

> ### Posso utilizar frameworks/bibliotecas?
> *Resposta:* Não só pode como será um diferencial

> ### Quanto tempo tenho ?
> *Resposta:* Esperamos sua resposta em até 7 dias

> ### Qual banco de dados ?
> *Resposta:* Qualquer um, sendo o Postgres ou Mongodb um diferencial

