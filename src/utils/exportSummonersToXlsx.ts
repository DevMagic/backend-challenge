import xlsx from 'node-xlsx';

import { Summoner } from '../entity/Summoner';

function exportSummonersToXlsx(summoners: Summoner[]) {
  const spreadSheetHeader = [
    'Id',
    'Nickname',
    'Id da conta',
    'Nível de invocador',
    'Id do ícone',
    'Id do invocador',
  ]

  const summonersSheetData = summoners.map(summoner => [
    summoner.id,
    summoner.nickname,
    summoner.accountId,
    summoner.summonerLevel,
    summoner.profileIconId,
    summoner.summonerId,
  ]);

  const options = {
    '!cols': [
      { wch: 34 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 14 },
      { wch: 50 },
    ],
  };

  const buffer = xlsx.build([{ name: "Summoners", data: [spreadSheetHeader, ...summonersSheetData] }], options);

  return buffer;
}

export default exportSummonersToXlsx;