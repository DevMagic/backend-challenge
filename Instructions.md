# Challenge - Developer Backend - Ivanilson Santos

Aqui contêm as instruções para os acessos aos endponts dessa API.

## Tecnologias Usadas

- Nodejs.
- MongoDB, utilizando o Atlas.
- Framework ExpressJS para o tratamento das rotas.
- Bibliotca Mongoose para a estruturação de objeto do MongoDB.

##

### Rotas

#### Cadastro do Usuário

- POST: /user/register/

#### Login do Usuário

- POST: /user/login/

#### Cadastro do Summoner

- POST: /summoner/register/

#### Buscar todos os Summoners

- GET: /summoner/

#### Buscar todos os Summoners detalhadamente

- GET: /summoner/detailed/:nickname/:summonerLevelMin/:summonerLevelMax/:winsMin/:winsMin/:lossesMin/:lossesMax/

- OBS: É feito um filtro por vez, ou seja, só pode ser filtrado ou por nome ou por level, assim por diante, nunca dois ao mesmo tempo. Para os filtros numéricos, deve ser colocado tanto o minimo quanto o máximo, e o resto dos campos deve ser colocado um '@'. Se for colocado '@' em todo os parametros, o response será com todos os usuários. O Campo nome pode ser buscado com partes da string. Um exemplo de como deve ficar o endpoit: /summoner/detailed/@/@/@/10/50/@/@/

#### Deletar Summoner

- DELETE: /summoner/

- OBS: Só poderá ser deletado com o token que foi gerado pelo usuário que criou o summoner.

#### Atualizar Summoner

- PUT: /summoner/

OBS: Só poderá ser atualizado com o token que foi gerado pelo usuário que criou o summoner.

#### Gerar XLSX de todos os Summoners

- POST: /summoner/xlsx/


##### OBS

- Para iniciar o projeto, deve executar o arquivo server.js, iniciando na porta 3000.
- O Token expira depois de 10 horas que o usuário realizou o Login, podendo ser alterado no userControler.js.
- O usuário "Praymer" não consta na base de dados do League of Legends.
- Normalmente eu não subiria o arquivo .env para o repositório por qeustões de segurança, mas como se trata de um teste, estou disponibilizando para vocês terem a senha e o usuário do banco de dados do desafio.


