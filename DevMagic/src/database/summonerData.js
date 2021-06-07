const database = require('../infra/database');

exports.getSummoners = function () {
    return database.query('select * from summoner');
};

exports.getSummonerById = function (summonerId){
    return database.oneOrNone('select * from summoner where id = $1', [summonerId])
}

exports.postSummoners = function(summoner) {
    return database.one(
        'insert into summoner (nickname, accountid, summonerid, summonerlevel, profileiconid) values ($1, $2, $3, $4, $5) returning *',
        [summoner.name, summoner.accountId, summoner.id, summoner.summonerLevel, summoner.profileIconId]
    );
};

exports.deleteSummoners = function(summonerId){
    return database.none('delete from summoner where id = $1', [summonerId])
};

exports.updateSummoners = function(summonerAtt, summonerId){
    return database.none(
        'update summoner set nickname = $1, summonerLevel = $2 where id = $3',
        [summonerAtt.summonerName, summonerAtt.summonerLevel, summonerId]
    )
}