class Tabelas {
    iniciar(db) {
        this.db = db;

        this.criarTabela();
    }

    criarTabela() {
        const sql = `CREATE TABLE IF NOT EXISTS Summoner 
        (id SERIAL PRIMARY KEY, Nickname text NOT NULL, 
            AccountId text, SummonerLevel text, ProfileIconId text, SummonerId text)`;

        this.db.query(sql, erro => {
            if(erro) {
                throw new Error(erro);
            } else {
                console.log('Tabela criada.');
            }
        })
    }
}

module.exports = new Tabelas;