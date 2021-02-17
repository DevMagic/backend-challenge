<img src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend

O desafio é construir uma api rest que seja capaz de cadastrar, buscar, atualizar e apagar os jogadores, ela deverá ser capaz de consultar a <a href='https://developer.riotgames.com/'>Api da Riot Games</a> para trazer informações sobre os jogadores que serão cadastrados.

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

Para consumir a api é necessario criar uma conta na plataforma e ler a documentação, os endpoints que serão usados nesse projeto requerem autenticação e é possivel gerar um token com tempo de expiração para poder estar consumindo esse serviço.

## Challenge Accepted</a>

Deve ser construido uma tabela com essas colunas

| Id  | Nickname      | AccountId       | SummonerLevel | ProfileIconId | SummonerId         |
| --- | ------------- | --------------- | ------------- | ------------- | ------------------ |
| 1   | Old Wolf King | V94KgBnbbsaR4I4 | 100           | 4864          | OtaV_QBRbtzt7DtpZn |
| 2   | Wolf Old King | bsaR4I4V94KgBnb | 150           | 4684          | FtaZ_QBRbtzt7DtpZn |
| 3   | King Old Wolf | 4I4V94KgbsaRBnb | 500           | 4648          | GtaT_QBRbtzt7DtpZn |

<br>

### **CRIAR JOGADOR**

<br>

Deve possuir uma rota **POST** para cadastrar um JOGADOR, deverá receber os siguientes dados no corpo da requisição:

_Body_

```javascript
{
	"summonerName":"OldWolfKing"
}
```

A rota deve consumir o **SummonerName** do corpo e usar para consultar no end point abaixo da API riotgames as informações _AccountId_, _SummonerLevel_, _ProfileIconId_ e _Id_.

<br>

```javascript
/lol/emmnorsu/v4/summoners/by-name/{summonerName}?api_key={token}
```

### **Response**

<br>

> Status Code 200

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

_O ID do jogador pode ser tanto UUID ou numérico incremental_

<br>

### **LISTAR JOGADORES**

<br>

Deve possuir uma rota **GET** para listar as informações da tabela Summoner, modelo esperado do retorno abaixo:

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

<br>

Deve possuir uma rota **GET** que ira além de trazer as informações da tabela ira trazer as quantidades de vitorias e derrotas de cada jogador:

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

Para trazer essas informações deve consumir o endpoint da riotgames abaixo, ele retorna um array de objetos com informações de um Jogador com base no **encryptedSummonerId** enviado e cada objeto possui ás propriedades _wins_ e _losses_:

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

Deve ser feito a soma das vitorias e derrotas de cada objeto do array, lembrando que deve ser executado para cada jogador da tabela.

### **ATUALIZAR JOGADOR**

<br>

Deve possuir uma rota _PUT_ para atualizar somente o **summonerName** e **summonerLevel** do jogador através do ID:

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

<br>

Deve possuir uma rota _DELETE_ para apagar o jogador através do ID:

### **Response**

<br>

> Status Code 200

```javascript
{
    "message": "successfully deleted"
}
```

## Avaliação

...

## Dicas

...

## FAQ

> ### Posso utilizar frameworks/bibliotecas ?

> ### Quanto tempo tenho ?

> ### Qual banco de dados ?
