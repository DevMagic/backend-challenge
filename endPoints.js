const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const db = require('./baseDeDados.js');
const Summoner = require('./modeloSummoner.js');


//  Essa funçao aqui é usada para normalizar o "nomex", a forma que eu implantei a ideia de
// que cada nickname é unico, e garanti que a forma como a string é digitada nao quebra nada
function sanitize(string) {
  let retorno = string;
  retorno = retorno.toString();
  retorno = retorno.replace(/\s+/g, '');
  retorno = retorno.toLowerCase();
  return retorno;
}
// middleware que torna possivel ler o corpo da requisiçao
router.use(express.json());

router.post('/novo', async (req, res) => {

  // Espera uma entrada com o parametro "summonerName" no corpo, e lida com os possiveis casos onde isso pode dar errado

  if (!req.body.summonerName) {
    res.json({
      message: "voce fez algo errado!"
    })

  } else {

    let summonerName = req.body.summonerName;

    summonerName = sanitize(summonerName)

    const idreq = await Summoner.find({
      nomex: summonerName
    });

    // isso aqui foi uma gambiarra que eu inventei pra ver se o summoner ja esta na base ou nao
    // e vai aparecer mais vezes ao longo do codigo

    if (!idreq.length) {

      const resposta = await fetch(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.API_RIOT_KEY}`);
      const respostaJson = await resposta.json();

      const novosummoner = new Summoner({
        Nickname: respostaJson.name,
        AccountId: respostaJson.accountId,
        SummonerLevel: respostaJson.summonerLevel,
        ProfileIconId: respostaJson.profileIconId,
        SummonerId: respostaJson.id,
        nomex: summonerName
      })
      await novosummoner.save()

      res.json(respostaJson);

    } else {

      res.json({
        message: "Esse jogador ja existe na base de dados!"
      });

    }
  }



})

router.get('/all', async (req, res) => {

  // a melhor rota de todas, só precisa mandar o pedido e é isso aí, sem dor de cabeça

  const consultaDb = await Summoner.find({}).select('-nomex');
  res.json(consultaDb);
})

router.get('/detalhes', async (req, res) => {

// essa aqui tambem só precisa chamar, mas foi meio esquisito pra fazer funcionar!

// aqui ela pede pro mongoDB o documento com todos os summoners, e prepara um array pra colocar todos os resultados
  const consultaDb = await Summoner.find({});

  const resposta = [];
// Para cada elemento do array que o mongoDB retorna, ele chama a api da riot, e separa a array da riot na variavel pedidoApiJson(um loop for por que um .forEach nao funciona com async)
// tambem prepara uma array para os objetos de cada fila ranqueada diferente
  for (let i = 0; i < consultaDb.length; i++) {
    let summonerid = consultaDb[i].SummonerId;

    const pedidoApi = await fetch(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}?api_key=${process.env.API_RIOT_KEY}`);
    const pedidoApiJson = await pedidoApi.json();

    const dadosSelecionados = [];

    // Aqui eu me aproveitei da array de todos os summoners, para inserir no objeto descartavel o retorno esperado, e ao mesmo tempo
    // sao calculadas as partidas totais somando os wins e losses.
    // tudo isso entra no objeto descartavel, que é colocado na array dadosSelecionados, que vai ser retornada!
    pedidoApiJson.forEach((j) => {
      let objetoDescartavel = {};
      let winsx = j.wins;
      let lossesx = j.losses;
      objetoDescartavel.id = pedidoApiJson.indexOf(j) + 1;
      objetoDescartavel.nickname = consultaDb[i].Nickname;
      objetoDescartavel.accountId = consultaDb[i].AccountId;
      objetoDescartavel.summonerLevel = consultaDb[i].SummonerLevel;
      objetoDescartavel.profileIconId = consultaDb[i].SummonerLevel;
      objetoDescartavel.summonerid = consultaDb[i].SummonerLevel;
      objetoDescartavel.wins = winsx;
      objetoDescartavel.losses = lossesx;
      objetoDescartavel.total = winsx + lossesx;
      dadosSelecionados.push(objetoDescartavel);
    });
    // quando eu coloquei o meu nick pra ver o que aparecia eu reparei que só voltava uma array vazia, ja que como a conta esta inativa,
    // eu nao apareço em nenhuma fila ranqueada.
    // entao pra nao sair um negocio esquisito pra cada jogador que nao esta em fila, ele insere essa mensagem.
    if (!pedidoApiJson.length) dadosSelecionados.push('message: jogador inativo, ou nao participante das filas ranqueadas');

    resposta.push(dadosSelecionados);
  }

  res.json(resposta);
})

router.put('/atualizar', async (req, res) => {
// aqui ele olha se tem o nome atual que é a forma de chamar o "id(que nao é bem id)" "nomex" veio no pedido.
// se nao veio o roteador fica muito chateado e reclama.
  if (!req.body.summonerName) {
    res.json({
      message: "voce fez algo errado"
    })
  } else {
// pegando os parametros do corpo, nao sao todos requeridos, mas eu preferi procurar todos.
    let summonerNameNova = req.body.summonerNameNova;
    let antigoNomex = req.body.summonerName;
    let novoNomex = summonerNameNova;
    let summonerLevelNova = req.body.summonerLevel;

// mais uma gambiarra, se voce nao quer trocar o nome, nao precisa mandar, e o roteador copia o que ja existe,
// para depois repetir ele.
    if (!req.body.summonerNameNova) {
      summonerNameNova = antigoNomex;
      novoNomex = antigoNomex;
    }

    antigoNomex = sanitize(antigoNomex);
    novoNomex = sanitize(novoNomex);
// isso aqui me encheu muito o saco pra garantir que o nivel é um numero mesmo e nao alguma coisa esquisita de javascript.
    summonerLevelNova = parseInt(summonerLevelNova);
    if (isNaN(summonerLevelNova)) {

      res.json({
        message: "O summonerLevel deve ser um numero"

      })

    } else {
// aqui ele procura o nome, pra ver se o summoner realmente existe na base, por que se nao nao tem como atualizar né?
      const idreq = await Summoner.find({
        nomex: antigoNomex
      });
// avisei la em cima que essa gambiarra aparecia mais algumas vezes hahahahaha;
      if (!idreq.length) {
        res.send("esse summoner nao existe na base de dados")
      } else {
// e isso aqui é pra ver se voce nao esta querendo dar uma de engraçadao tentando copiar o nick de algum amiginho.
        const testeRepetido = await Summoner.find({
          nomex: novoNomex
        });

        if (testeRepetido.length) {

          res.json({
            message: "esse nome nao esta disponivel"
          });
// se tudo der certo, aqui ele realmente atualiza os novos nomes e niveis.
        } else {

          const id = idreq[0]._id;

          const update = await Summoner.findByIdAndUpdate(id, {
            SummonerLevel: summonerLevelNova,
            Nickname: summonerNameNova,
            nomex: novoNomex
          }, {
            runValidators: true,
            new: true
          });

          res.json(update);

        }


      }

    }
  }
})

router.delete('/delete', async (req, res) => {
// se voce quer deletar algo, por favor mande algo para ser deletado!
  if (!req.body.summonerName) {
    res.json({
      message: "voce fez algo errado"
    })
  } else {

    let summonerNameNova = req.body.summonerName;
    summonerNameNova = sanitize(summonerNameNova);

    const idreq = await Summoner.find({
      nomex: summonerNameNova
    });
// acredita que a gambiarra vai aparecer mais uma vez depois dessa?
    if (!idreq.length) {
      res.json({
        message: "esse jogador nao existe na base de dados"
      })
    } else {
// se tudo deu certo aqui voce vai conseguir deletar o que voce quer tanto deletar.
      const id = idreq[0]._id;

      const deletar = await Summoner.findByIdAndDelete(id);
      res.json({
        message: "sucessfully deleted"
      });
    }
  }
})
/* ______________________
  |       ATENÇAO       |
  |______________________

  As rotas a seguir nao estao documentadas, mas funcionam como as outras,
  use com cuidado.
  ------>USE A ROTA PARA POPULAR A BASE APENAS SE ELA ESTIVER VAZIA, DO CONTRARIO ALGO VAI QUEBRAR<---------
  */
router.delete('/d', async (req, res) => {
//por favor use isso aqui só se voce quer muito mesmo
  await Summoner.deleteMany({});
  res.json({
    message: "voce deletou a base de dados por completo"
  });
})

router.post('/p', async (req, res) => {
// tem certeza que esta tudo vazio mesmo??
// olhe mais uma vez
// por favor mais uma só pra garantir mesmo
  let summoners = [
    'oldWolfKing',
    'praymer',
    'threkSor',
    'andrewDiass',
    'biliBoss',
    'dartSecond',
    'devils Advocate',
    'gabrvxo',
    'theKovac',
    'zRabelo',
    'thmtvz'
]
  for(let i = 0; i < summoners.length;i++){
    let summonerName = summoners[i];

    summonerName = sanitize(summonerName)

    const idreq = await Summoner.find({
      nomex: summonerName
    });
    if (!idreq.length) {
      const resposta = await fetch(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.API_RIOT_KEY}`);
      const respostaJson = await resposta.json();

      const novosummoner = new Summoner({
        Nickname: respostaJson.name,
        AccountId: respostaJson.accountId,
        SummonerLevel: respostaJson.summonerLevel,
        ProfileIconId: respostaJson.profileIconId,
        SummonerId: respostaJson.id,
        nomex: summonerName
      })
      await novosummoner.save()

  };
}
res.json({message: "voce populou a base de dados!"})
})

module.exports = router;
