<img  src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend


## Configurações necessárias antes de rodar o projeto:

<ul>
  <li>Crie um arquivo chamado **.env** </li>
  <li>Dentro desse arquivo é necessário configurar duas variáveis ambiente:</li>

  -[ ] PORT (porta que o projeto irá usar);
  <br>
  -[ ] RIOT_KEY (key de desenvolvedor da <a href="https://developer.riotgames.com/" target="_blank">riot games</a>).

  <li>Outro detalhe que é importante destacar é que a porta 5432 de seu computador precisa estar livre, pois se não poderá ocorrer erro ao iniciar o docker com o banco de dados</li>
</ul>


## Para iniciar o projeto:

```bash
#download packages
$ npm / yarn install

#get packages docker (postgres)
$ docker-compose build

# initialize docker
$ docker-compose up -d

# development
$ npm run / yarn start

# watch mode
$ npm run / yarn start:dev

# production mode
$ npm run / yarn start:prod
```

## Rotas 

GET /players
```json
	[  
    {
      "id": 4,
      "Nickname": "Old Wolf King",
      "AccountId": "zhN5_VnaVVzana_2l6AgVJDrqYokdN5vts_asdvjbhjasdvh",
      "SummonerLevel": 234,
      "ProfileIconId": "3534",
      "SummonerId": "WcX8ZXkamtRoGfIKMjBtvEBe89ds8Alc8Hsvaioniosa"
   	}
	]
```

GET /players/details
```json
	[  
    {
      "id": 4,
      "Nickname": "Old Wolf King",
      "AccountId": "zhN5_VnaVVzana_2l6AgVJDrqYokdN5vts_asdvjbhjasdvh",
      "SummonerLevel": 234,
      "ProfileIconId": "3534",
      "SummonerId": "WcX8ZXkamtRoGfIKMjBtvEBe89ds8Alc8Hsvaioniosa",
      "wins": 37,
      "loses": 25
    }
	]
```

POST /players 
send:
```json
	{
		"summonerName":"OldWolfKing"
	}
```

return:
```json
	{
    "id": "WcX8ZXkamtRoGfIKMjBtvEBe89ds8Alc8Hsvaioniosa",
    "accountId": "zhN5_VnaVVzana_2l6AgVJDrqYokdN5vts_asdvjbhjasdvh",
    "puuid": "BEiwuSmwRbqtoLivzi00KTE4mPqgyw4Z3HjeFjifnJvIj2H7qEgcd459_vTajNj_cdvsjbjh72dvds",
    "name": "Old Wolf King",
    "profileIconId": 3534,
    "summonerLevel": 234
  }
```

PUT /players/:id
send:
```json
	{
    "summonerName":"OldWolfKingMaster",
    "summonerLevel": 300
  }
```

return:
```json
	{
    "id": 3,
    "Nickname": "OldWolfKingMaster",
    "AccountId": "zhN5_VnaVVzana_2l6AgVJDrqYokdN5vts_asdvjbhjasdvh",
    "SummonerLevel": 300,
    "ProfileIconId": "3534",
    "SummonerId": "WcX8ZXkamtRoGfIKMjBtvEBe89ds8Alc8Hsvaioniosa"
  }
```


DELETE /players/:id
return:
```json
	{
    "message": "successfully deleted"
  }
```