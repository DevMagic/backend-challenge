<img src='https://devmagic.com.br/wp-content/uploads/2020/07/logo_footer.png'>

# Challenge - Developer Backend | Pedro Soares

## Technologies Stack

`NestJS` `MongoDB` `Axios` 

## Installation

```bash
$ yarn | npm install
```

To have the access keys, copy the file `.env.example` for the `.env`.

```bash
$ cp .env.example .env
```

Set your token from the <a href='https://developer.riotgames.com/'>API League of Legends</a> on the `RIOT_API_TOKEN`.

And set `DB` variables (`DB_USER`, `DB_PASSWORD`, `DB_HOST`,`DB_NAME`)

## Running

```bash
# Run the application in development mode
$ (npm run | yarn) start

# Run the application in development mode with file modification monitoring
$ (npm run | yarn) start:dev

# Run the application in production mode
$ (npm run | yarn) start:prod
```

## Documentation

### Swagger IO

- To access the documentation, in your browser, go to: http://localhost:3000/swagger

# API

## Register Summoner

> POST `/summoners`


### Request Body
```json
{
  "summonerName": "OldWolfKing"
}
```

### Curl

```bash
curl --request POST \
     --url http://localhost:3000/summoners \
     --header 'Content-Type: application/json' \
     --data '{ "summonerName": "OldWolfKing" }'
```

### Response Status Code

> 201 Created

### Response Body

```json
{
  "id": "e2628230-caff-11eb-9b56-81fab2db61e1",
  "nickname": "Old Wolf King",
  "accountId": "tJBkm5MT-UmDBIzy8egfzQLwSl7dNrZeI__VrB0348YP5Fg",
  "summonerLevel": 237,
  "profileIconId": 4903,
  "summonerId": "IPmOC4F1HUAz052mk2c7xU-uJpv0HkeDBwgD4vgwfOp-RCs"
}
```

## List Summoners

> GET `/summoners`

```bash
curl --request GET \
     --url http://localhost:3000/summoners
```

### Response Status Code

> 200 OK

### Response Body

```json
[
  {
    "id": "e2628230-caff-11eb-9b56-81fab2db61e1",
    "nickname": "Old Wolf King",
    "accountId": "tJBkm5MT-UmDBIzy8egfzQLwSl7dNrZeI__VrB0348YP5Fg",
    "summonerLevel": 237,
    "profileIconId": 4903,
    "summonerId": "IPmOC4F1HUAz052mk2c7xU-uJpv0HkeDBwgD4vgwfOp-RCs"
  },
  {
    "id": "73a3aeb0-caf4-11eb-b090-35d257b933db",
    "nickname": "ThrekSor",
    "accountId": "1EHFoad6miZWfcQHdBU8Bx8PE_cylvoC4finxxJKTYz92eI",
    "summonerLevel": 307,
    "profileIconId": 777,
    "summonerId": "aJW1twscXebozIo9P4hl-LUAxjz6AlO0NLt_7h4c8Kd4CQ"
  }
]
```

## List Summoners with detailed information

> GET `/summoners?detailedInfo=true`

### Curl

```bash
curl --request GET \
     --url 'http://localhost:3000/summoners?detailedInfo=true'
```

### Response Status Code

> 200 OK

### Response Body

```json
[
  {
    "id": "e2628230-caff-11eb-9b56-81fab2db61e1",
    "nickname": "Old Wolf King",
    "accountId": "tJBkm5MT-UmDBIzy8egfzQLwSl7dNrZeI__VrB0348YP5Fg",
    "summonerLevel": 237,
    "profileIconId": 4903,
    "summonerId": "IPmOC4F1HUAz052mk2c7xU-uJpv0HkeDBwgD4vgwfOp-RCs",
    "wins": 38,
    "losses": 35
  },
  {
    "id": "73a3aeb0-caf4-11eb-b090-35d257b933db",
    "nickname": "ThrekSor",
    "accountId": "1EHFoad6miZWfcQHdBU8Bx8PE_cylvoC4finxxJKTYz92eI",
    "summonerLevel": 307,
    "profileIconId": 777,
    "summonerId": "aJW1twscXebozIo9P4hl-LUAxjz6AlO0NLt_7h4c8Kd4CQ",
    "wins": 223,
    "losses": 205
  }
]
```

## Update Summoner

> PUT `​/summoners/:id`

### Request Body

```json
{
  "summonerName": "OldWolfKingMaster",
  "summonerLevel": 550
}
```

### Curl

```bash
curl --request PUT \
     --url http://localhost:3000/summoners/1dbf0ee0-caf9-11eb-928f-73d7f687b8ed \
     --header 'Content-Type: application/json' \
     --data '{ "summonerName":"OldWolfKingMaster", "summonerLevel": 550 }'
```

### Response Status Code

> 200 OK

### Response Body

```json
{
  "id": "d5105ef0-caea-11eb-bbe7-cb19545b6443",
  "nickname": "OldWolfKingMaster",
  "accountId": "mf_W08JhUo10FvvJrKZaHXpILSYl1UtHFhb0z7e_7R4CUwU",
  "summonerLevel": 550,
  "profileIconId": 3534,
  "summonerId": "5dKiOH-l6JPgZL04748EMj8ZaC2xRzoviOlTOjkvdcdwL3w"
}
```

## Delete Summoner

> DELETE `​/summoners/:id`

### Curl

```bash
curl --request DELETE \
     --url http://localhost:3000/summoners/1dbf0ee0-caf9-11eb-928f-73d7f687b8ed
```

### Response Status Code

> 200 OK

### Response Body

```json
{
  "message": "successfully deleted"
}
```
