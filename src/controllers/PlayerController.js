import Summoner from '../models/Summoner.js';
import aws from '../services/aws.js';
import api from '../services/api.js';
import jwt from 'jsonwebtoken';
import xl from 'excel4node';
import fs from 'fs';
import AWS from 'aws-sdk';
import path from 'path';

function verifyToken(challenge_token) {
  let decodedToken = '';
  if (!challenge_token)
    return response
      .status(401)
      .json({ auth: false, message: 'No token provided.' });

  jwt.verify(challenge_token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return response
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });

    decodedToken = decoded;
  });

  return decodedToken._id;
}

async function getAPIData(summonerId) {
  const apiToken = process.env.API_TOKEN;

  const { data } = await api.get(
    `/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiToken}`,
  );

  return data;
}

async function getDetailedList(summoners) {
  let detailedList = [];

  for (const summoner of summoners) {
    const data = await getAPIData(summoner.summonerId);
    let wins = 0;
    let losses = 0;

    for (const dataItem of data) {
      wins += dataItem.wins;
      losses += dataItem.losses;
    }

    const detailedListItem = {
      _id: summoner._id,
      nickname: summoner.nickname,
      accountId: summoner.accountId,
      summonerLevel: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
      summonerId: summoner.summonerId,
      userId: summoner.userId,
      wins,
      losses,
    };

    detailedList.push(detailedListItem);
  }

  return detailedList;
}

function createXLSX(detailedList) {
  const workbook = new xl.Workbook();
  const worksheet = workbook.addWorksheet('Players List');
  const worksheetTitles = [
    '_id',
    'nickname',
    'accountId',
    'summonerLevel',
    'profileIconId',
    'summonerId',
    'userId',
    'wins',
    'losses',
  ];

  let titleColumnIndex = 0;
  worksheetTitles.forEach((title) => {
    worksheet.cell(1, (titleColumnIndex += 1)).string(title);
  });

  let rowIndex = 2;
  detailedList.forEach((listItem) => {
    let columnIndex = 0;
    Object.keys(listItem).forEach((columnName) => {
      worksheet
        .cell(rowIndex, (columnIndex += 1))
        .string(String(listItem[columnName]));
    });
    rowIndex += 1;
  });

  return workbook;
}

function createFileredList(
  detailedList,
  nickname,
  summonerLevel,
  wins,
  losses,
) {
  function filterItems(item) {
    if (
      (String(item.nickname) === String(nickname) && nickname) ||
      (Number(item.summonerLevel) === Number(summonerLevel) && summonerLevel) ||
      (Number(item.wins) === Number(wins) && wins) ||
      (Number(item.losses) === Number(losses) && losses)
    ) {
      return item;
    }
  }
  return detailedList.filter(filterItems);
}

async function createBucket() {
  const ID = await aws.get('/ID.txt');
  const KEY = await aws.get('/KEY.txt');
  const id = ID.data;
  const key = KEY.data;
  const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: key,
  });
  const BUCKET_NAME = 'devmagic-challenge';

  const params = {
    Bucket: BUCKET_NAME,
  };

  s3.createBucket(params, (error, data) => {
    if (error) console.error({ error, type: 'Error on bucket' });
    // else {
    //   console.log(data.Location);
    // }
  });
}

async function uploadFile(filename, date) {
  const BUCKET_NAME = 'devmagic-challenge';
  const objetctKey = `playerslist-${date}.xlsx`;
  const ID = await aws.get('/ID.txt');
  const KEY = await aws.get('/KEY.txt');
  const id = ID.data;
  const key = KEY.data;
  const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: key,
  });

  const fileContent = fs.readFileSync(filename);

  const fileParams = {
    Bucket: BUCKET_NAME,
    Key: objetctKey,
    Body: fileContent,
    ContentType: 'application/octet-stream',
    ACL: 'public-read',
  };

  s3.upload(fileParams, (error, data) => {
    if (error) console.error({ error, type: 'Error uploading' });
    // else {
    //   console.log('Uploaded', data.Location);
    // }
  });

  const signedUrlExpireSeconds = 60 * 5; // your expiry time in seconds.

  const url = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: objetctKey,
    Expires: signedUrlExpireSeconds,
  });

  return url;
}

export default {
  async index(request, response) {
    try {
      const { challenge_token } = request.headers;
      const { nickname, summonerLevel, wins, losses } = request.query;
      const userId = await verifyToken(challenge_token);

      //Many requests to the API so it takes a while
      const summoners = await Summoner.find({ userId });
      const detailedList = await getDetailedList(summoners);

      if (nickname || summonerLevel || wins || losses) {
        const filteredList = createFileredList(
          detailedList,
          nickname,
          summonerLevel,
          wins,
          losses,
        );

        return response.status(200).json(filteredList);
      } else {
        return response.status(200).json(detailedList);
      }
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async update(request, response) {
    try {
      const { challenge_token, _id } = request.headers;
      const { summonerName, summonerLevel } = request.body;
      const userId = await verifyToken(challenge_token);

      const summoner = await Summoner.findOneAndUpdate(
        { userId, _id },
        {
          nickname: summonerName,
          summonerLevel: summonerLevel,
        },
        {
          returnOriginal: false,
        },
      );

      return response.status(200).json(summoner);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async delete(request, response) {
    try {
      const { challenge_token, _id } = request.headers;
      const userId = await verifyToken(challenge_token);

      await Summoner.findOneAndRemove(
        { userId, _id },
        {
          returnOriginal: false,
        },
      );

      return response.status(200).json({
        message: 'successfully deleted',
      });
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async export(request, response) {
    try {
      const { challenge_token } = request.headers;
      const userId = await verifyToken(challenge_token);

      //Many requests to the API so it takes a while
      const summoners = await Summoner.find({ userId });
      const detailedList = await getDetailedList(summoners);

      const date = Date.now();
      const pathToFile = path.resolve(`./tmp/playerslist-${date}.xlsx`);

      const workbook = createXLSX(detailedList);
      workbook.write(pathToFile); //Test if the xlsx is right

      await createBucket();
      const xlsxURL = await uploadFile(pathToFile, date);

      return response.status(200).json({ url: xlsxURL });
      // return workbook.write(`playerslist-${date}.xlsx`, response);
    } catch (error) {
      return response.status(400).json({ error, type: 'Error on response' });
    }
  },
};
