import { Response } from 'express';
import { getRepository } from 'typeorm';

import { Summoner } from '../entity/Summoner';
import { User } from '../entity/User';

import { AuthenticatedRequest } from '../middlewares/authenticationMiddleware';
import riotApi from '../services/riotApi';
import prettifyPromise from '../utils/prettifyPromise';

export default class SummonerController {
  static async create(request: AuthenticatedRequest, response: Response) {
    const { summonerName } = request.body;

    const userRepository = getRepository(User);
    const summonerRepository = getRepository(Summoner);

    const [user, findUserError] = await prettifyPromise(userRepository.findOneOrFail(request.userId));

    if (findUserError) {
      return response.status(401).json({ error: 'Usuário inválido' });
    }

    const [apiResponse, apiError] = await prettifyPromise(riotApi.get(`/lol/summoner/v4/summoners/by-name/${summonerName}`));

    if (apiError) {
      return response.status(500).json({ error: 'Erro ao se comunicar com a API da Rito' });
    }

    const { id, name, accountId, summonerLevel, profileIconId } = apiResponse.data;


    const [summoner, createSummonerError] = await prettifyPromise(summonerRepository.save({
      nickname: name,
      accountId,
      summonerLevel,
      profileIconId,
      summonerId: id,
      user
    }));

    if (createSummonerError) {
      return response.status(400).json({ error: 'Erro ao criar summoner' });
    }

    return response.status(201).send();
  }
}