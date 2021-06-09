const db = require('../../config/db')

class MainModels {
    async cadastra(dados) {
        try {
            await db.query(`INSERT INTO Summoner (nickname, accountid, summonerlevel, profileiconid, summonerid) 
            VALUES ($1, $2, $3, $4, $5)`, [dados.name, dados.accountId, dados.summonerLevel, dados.profileIconId, dados.id]);
        } catch (error) {
            throw new Error(error);
        }
    }

    async pega() {
        try {
           const rows = await db.query(`SELECT * FROM summoner`);

           return rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async edita (summonerNome, summonerLevel, paramsId) {
        try {
            const dados = await db.query(`UPDATE summoner SET nickname = $1, summonerlevel = $2 WHERE id = $3`, [summonerNome, summonerLevel, paramsId]);

            return dados;
        } catch (error) {
            throw new Error(error);
        }
    }

    async pegaporId(paramsId) {
        try {
           const rows = await db.query(`SELECT * FROM summoner WHERE id = $1`, [paramsId]);

           return rows;
        } catch (error) {
            throw new Error(error)
        }
    }

    async deletaporId(paramsId) {
        try {
           const rows = await db.query(`DELETE FROM summoner WHERE id = $1`, [paramsId]);

           return rows;
        } catch (error) {
            throw new Error(error)
        }
    }

    async JaCadastrado(paramsName) {
        try {
          const rows = await db.query(`SELECT * FROM summoner WHERE nickname = $1`, [paramsName]);

          return rows;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new MainModels();