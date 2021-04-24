
# Challenge - Developer Backend

## Dependencias do projeto:
* dotenv -> para acessar o arquivo .env
* express -> framework para estruturar o servidor, inclusive o proprio que o NestJs é baseado
* mongoose -> framework para trabalhar com o banco de dados mongoDB
* node-fetch -> para fazer as chamadas na api da riot games

### Para executar o codigo:
antes de iniciar o "node index.js", entre no arquivo .env para adicionar sua chave da api riot games!

```sh
git clone https://github.com/thmtvz/backend-challenge.git
cd backend-challange
node index.js
```
### Endpoints aceitos
* localhost:3000/api/novo -> espera uma requisiçao post com um body de {"summonerName": "*summoner name desejado*"}
* localhost:3000/api/all -> espera apenas uma requisiçao get
* localhost:3000/api/detalhes -> espera apenas uma requisiçao get
* localhost:3000/api/atualizar -> espera uma requisiçao put com um body {"summonerName":"*summonerName atual*","summonerNameNova":"*o novo summoner name desejado*","summonerLevel":"*novo summoner level desejado*"}
* localhost:3000/api/delete -> espera uma requisiçao delete com um body {"summonerName":"*summonerName que sera deletado*"

### Site Live no glitch
https://picayune-solstice-poet.glitch.me -> o proprio site.
https://glitch.com/edit/#!/picayune-solstice-poet -> o codigo dentro do glitch.
