<img src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend

<br>

Desafio proposto pela DEVMAGIC onde é necessario elaborar um APIREST CRUD para jogadores. Utilizando da api oficial da riot games para coletar dados destes jogadores.

## Challenge Accepted</a>

<br>

### Pré-requisitos

Antes de começar, é necessario ter em sua maquina instalado os seguintes softwares:
- Node.js
- Npm ou Yarn
- Git
- Docker
- Nest

#1 
#Clone este repositório
git clone https://github.com/Arduke/backend-challenge.git

#2 
#Acesse a pasta do projeto

#3
#Rode o seguinte codigo no cmd, ele vai criar um container com o PGSQL configurado
docker-compose up -d

#4
#Tenha uma conta na <a href='https://developer.riotgames.com/'>Api da Riot Games</a>, vá no arquivo .env e altere a variavel API_KEY para a sua key fornecida pela RIOTGAMES

#5
#Por final inicie o projeto com um dos seguintes scripts
yarn start 
ou
npm run start

#6 
#Interessado em acesso os dados do banco de dados no dockers, vá até o navegador e entre na rota #localhost:8080
#usuario: pguser
#senha: pgpassword

<br>

### Tecnologias

As seguintes ferramentas foram usadas na construção do projeto
-[Node.js]
-[Docker]
-[TypeScript]
-[Nest.js]
-[PostgreSQL]
-[TypeOrm]


### Endpoint

<br>


### **CRIAR JOGADOR**

Rota POST para cadastrar um JOGADOR. Deverá receber os seguintes dados no corpo da requisição:
ENDPOINT: *http://localhost:3000/players/create*

_Body_

```javascript
{
	"summonerName":"OldWolfKing"
}
```
### **Response**

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

### **LISTAR JOGADORES**

Rota GET para apresentar a lista de jogadores.
ENDPOINT: *http://localhost:3000/players*

### **Response**

> Status Code 200
```javascript 
[
  {
    "id": "18b2147f-748f-49c6-be26-93e2b778a299",
    "nickname": "Arduke",
    "accountId": "7oUrzpQfDgFXH0qDTP0ZxsuYrDJkPXwsF2J1bcjG4B9O",
    "summonerLevel": "17",
    "profileIconId": "983",
    "summonerId": "sUUJgP-W_BvuHw_meyt62gGcylepg5zBfk-1qc6q_qySJQ"
  },
  {
    "id": "8e0101a8-b64e-4251-8546-115fd921a5da",
    "nickname": "Old Wolf King",
    "accountId": "uDOJK2xhY2k1A3pE4L9ezMoHY9j7TNzgXcKYebRoBfZT1UY",
    "summonerLevel": "230",
    "profileIconId": "4864",
    "summonerId": "lojyiPSNkZACenaQ-dA1YIfulwe9bfLGCIL4BnCIaMM7pkg"
  },
  {
    "id": "3643d04b-79bd-45f0-bb21-9f23fd6d88d5",
    "nickname": "Leguard",
    "accountId": "Fagtcpcdg6gFre8N_tOiX_oZP7fMSUgnVTbo-_TeXkuW",
    "summonerLevel": "30",
    "profileIconId": "940",
    "summonerId": "uYCJmsyEHfVjbIkK0kSqmJiVHYV67FMo1BjIGWDtEekZDw"
  },
  {
    "id": "092501c7-4d59-4bb6-9a8e-47840d2a3b81",
    "nickname": "Muleque Lixu",
    "accountId": "6KBBhiixX-YpFf4U8iQq0FveeO2h2o8HqJUALluTsw1ujnM",
    "summonerLevel": "324",
    "profileIconId": "4025",
    "summonerId": "-z2g1qiMgVtkEjNyquwZ1AeGQmPg3dkMlqUAWgBxfRRPXg"
  }
]
```

### **LISTAR INFORMAÇÕES DETALHADAS DOS JOGADORES**

Rota *GET* para apresentar a lista detalhada de jogadores. Nela contem a soma de vitorias e derrotas de cada jogados no modos RANKED-FLEX e RANKED-SOLODUO 
ENDPOINT: *http://localhost:3000/players/details*



### **Response**

> Status Code 200
```javascript
[
  {
    "id": "18b2147f-748f-49c6-be26-93e2b778a299",
    "nickname": "Arduke",
    "accountId": "7oUrzpQfDgFXH0qDTP0ZxsuYrDJkPXwsF2J1bcjG4B9O",
    "summonerLevel": "17",
    "profileIconId": "983",
    "summonerId": "sUUJgP-W_BvuHw_meyt62gGcylepg5zBfk-1qc6q_qySJQ",
    "wins": 0,
    "losses": 0
  },
  {
    "id": "99bed59f-b25a-46a7-93fb-14a1f122e7f9",
    "nickname": "SOU MUITO RUIM",
    "accountId": "UHdvEJmB3AN7XiS-K1f8VXccvC0tZRGXmIggyZx11qGkUd0",
    "summonerLevel": "206",
    "profileIconId": "3478",
    "summonerId": "M6IftDZwxgJN4Lh9Po3j46RM7m1MAdYXTe-5Vf9wQR_oZQ",
    "wins": 15,
    "losses": 7
  }
]
``` 

### **ATUALIZAR JOGADOR**

Rota *PUT* ara atualizar somente o **summonerName** e **summonerLevel** do jogador através do ID:
ENDPOINT: *http://localhost:3000/players/edit/{PlayerId}*

_Body_

```javascript
{
  "summonerName" : "KaduEdu",
	"summonerLevel" : "500"
}
```
### **Response**

> Status Code 200
```javascript
{
  "id": "81111971-ab24-4842-9191-fe965a8eedbb",
  "name": "KaduEdu",
  "accountId": "KHfn1ggfBQUN37oKPLjkvmFyRGSIP3bOFf6J15CJpU_YkcY",
  "summonerLevel": "500",
  "profileIconId": "4779",
  "summonerId": "AuALN8BSZAcmMxUMz6o1E9OKuIxVlKbns3w3yxkTMnf4bQ",
  "puuid": "qukq3k-kr3oJFk74wyiteIUmmZbN3-7clbmpKaKJPW3uT8HDwNvB9iTSARCXdVHuBM7jErHT9L9iZg",
  "revisionDate": "1616245847000",
  "createdAt": "2021-03-22T03:39:46.590Z",
  "deletedAt": null
}
```

### **APAGAR JOGADOR**

Rota *DELETE* para deletar jogador através do ID
ENDPOINT: *http://localhost:3000/players/delete/{PlayerId}*


### Autor
---

<a href="https://github.com/Arduke/">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/23370502?s=400&u=e90105ccb424867e8579d4a54bc09227e7c92eaf&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Carlos Eduardo</b></sub></a> <a href="https://github.com/Arduke/" title="KDUDEV">🚀</a>


Feito com ❤️ por Carlos Eduardo 👋🏽 Entre em contato!
