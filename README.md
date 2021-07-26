<img src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend

O desafio foi construir uma API Rest que seja capaz de cadastrar, buscar, atualizar e apagar os jogadores, utilizando **Node.js** no servidor.
Ela é capaz de consultar a Api da Riot Games para trazer os dados dos jogadores que serão cadastrados em uma base de dados **MongoDB**.


# 🟢 Preview

Você pode ter acesso a uma vizualização mais amigável das rotas e requests <a href='https://leandrolid.github.io/backend-challenge'>acessando esse link</a>
<br>
<br>
<br>

# 🟣 Rotas e requests

## Signup [/signup]

### Create [POST]
Para adicionar um usuário é preciso informar um json com as ``chaves name, email e password``.

+ Request (application/json)

    + Attributes (CreateRequest)


    + Body

            {
                "name": "gabriel",
                "email": "gabriel@gabriel.com",
                "password": "1213141516"
            }


+ Response 200 
    + Attributes (object)






## Login [/login]

### Create [POST]
Após ter seu usuário criado será preciso informar seu ``email e senha`` para efetuar login.
Se as informações passadas baterem com as salvas no banco de dados, será retornado um ``token`` para o usuário.

+ Request (application/json)

    + Attributes (CreateRequest)


    + Body

            {
                "name": "gabriel",
                "email": "gabriel@gabriel.com",
                "password": "1213141516"
            }


+ Response 200 
    + Attributes (object)







## Summoners [/summoners]

### Create [POST]
Você pode criar um summoner enviando o ``summonerName`` no body e o ``token`` recebido no header, para validação.

+ Request (application/json)
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjM3MDQ0MTgsImV4cCI6MTYyMzc5MDgxOH0.0FrqZG82D5zYdSYU0Vb5m59PI1qWh6_ZtEyxa946EE8


    + Attributes (CreateRequest2)


    + Body

            {
                "summonerName": "zRabelo"
            }


+ Response 200 
    + Attributes (object)



### Index [GET]
Para listar os summoners criados por você basta apenas enviar o ``token`` recebido anteriormente no header da requisição.

+ Request 
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjQ0ODI0MTgsImV4cCI6MTYyNDU2ODgxOH0.dKF2Hus4LptMx5OPFX3m5XlJCS_n8-Antpz1rdadyNA





+ Response 200 
    + Attributes (object)




## Players [/players]

### Delete [DELETE]
Para apagar um registro é preciso enviar o ``_id`` do registro e o ``token`` no header da requisição.

+ Request 
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjM3MTU1OTEsImV4cCI6MTYyMzgwMTk5MX0.gcHZRkW-Y5BhD1TBS02yqs6pENfHUP3YQfeHE6T4r_o
            _id:d2f6e925-032b-46af-b402-1e5bf92131cf





+ Response 200 
    + Attributes (object)



### Export [POST]
Para exportar um arquivo ``.xlsx`` com os dados detalhados dos registros basta apenas enviar o ``token`` no header da requisição.

+ Request 
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjQ0NzY4ODUsImV4cCI6MTYyNDU2MzI4NX0.vuzPn0Rgb0NhBmPOXuM9bimGAxl-gCU7CN2H93r0FwM





+ Response 200 
    + Attributes (object)



### Update [PUT]
Para atualizar um registro é preciso passar o token e o _id do registro a ser alterado no header da requisição, alé disso, os dados novos ( ``nickname``, ``summonerLevel``, ``profileIconId``, etc.) devem ser passados no body.

+ Request (application/json)
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjQ0ODI0MTgsImV4cCI6MTYyNDU2ODgxOH0.dKF2Hus4LptMx5OPFX3m5XlJCS_n8-Antpz1rdadyNA
            _id:e2d6132e-2f49-4060-b62c-8627876233cd


    + Attributes (UpdateRequest)


    + Body

            {
                "summonerName": "OldWolfKingMaster",
                "summonerLevel": 550
            }


+ Response 200 
    + Attributes (object)




### Index [GET]
Para listar os registros criados é preciso enviar o ``token`` no header e podem ser passados os filtros ``nickname, summonerLevel, wins e losses`` nos query params.
+ Parameters
    + nickname (string, required)

    + summonerLevel (string, required)

    + wins (string, required)

    + losses (string, required)


+ Request 
    + Headers

            challenge_token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzYzgyMDk4Mi1iNzkxLTQ5MDctYjkwMC1lN2FkMThlMzE1ODYiLCJpYXQiOjE2MjQ0ODI0MTgsImV4cCI6MTYyNDU2ODgxOH0.dKF2Hus4LptMx5OPFX3m5XlJCS_n8-Antpz1rdadyNA





+ Response 200 
    + Attributes (object)





