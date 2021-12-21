const path = require('path');
const xlsx = require('xlsx');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportSummonersToExcel = (summoners, workSheetColumnNames, workSheetName, filePath) => {
    const data = summoners.map(sum => {
        return [
            sum.id, sum.Nickname,sum.AccountId, sum.SummonerLevel
            , sum.ProfileIconId, sum.SummonerId, sum.userId
        ];
    });
    exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}

module.exports = exportSummonersToExcel;