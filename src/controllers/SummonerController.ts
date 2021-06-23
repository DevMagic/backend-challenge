import { Response } from 'express';
import { getRepository } from 'typeorm';

import { Summoner } from '../entity/Summoner';
import { User } from '../entity/User';

import { AuthenticatedRequest } from '../middlewares/authenticationMiddleware';
import riotApi from '../services/riotApi';
import exportSummonersToXlsx from '../utils/exportSummonersToXlsx';
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

  static async index(request: AuthenticatedRequest, response: Response) {
    const summonerRepository = getRepository(Summoner);

    const [summoners, findSummonersError] = await prettifyPromise(summonerRepository.find({
      where: {
        user: {
          id: request.userId,
        },
      },
    }));

    if (findSummonersError) {
      console.error(findSummonersError.stack);
      return response.status(500).json({ error: 'Erro ao listar summoners' });
    }

    return response.json(summoners);
  }

  static async detail(request: AuthenticatedRequest, response: Response) {
    const summonerRepository = getRepository(Summoner);

    const [summoners, findSummonersError] = await prettifyPromise(summonerRepository.find({
      where: {
        user: {
          id: request.userId,
        },
      },
    }));

    if (findSummonersError) {
      console.error(findSummonersError.stack);
      return response.status(500).json({ error: 'Erro ao listar summoners' });
    }

    const detailedSummoners = await Promise.all(summoners.map(async summoner => {
      type ResponseType = Array<{ wins: number, losses: number }>;

      const apiResponse = await riotApi.get<ResponseType>(
        `/lol/league/v4/entries/by-summoner/${summoner.summonerId}`
      );

      const wins = apiResponse
        .data
        .map(entry => entry.wins)
        .reduce((sum, wins) => sum + wins, 0);

      const losses = apiResponse
        .data
        .map(entry => entry.losses)
        .reduce((sum, losses) => sum + losses, 0);

      return {
        ...summoner,
        wins,
        losses,
      }
    }));

    return response.json(detailedSummoners);
  }

  static async update(request: AuthenticatedRequest, response: Response) {
    const { id } = request.params;
    const { summonerName, summonerLevel } = request.body;

    const summonerRepository = getRepository(Summoner);

    const [summoner, findSummonerError] = await prettifyPromise(summonerRepository.findOneOrFail(id));

    if (findSummonerError) {
      return response.status(404).json({ error: 'Summoner não encontrado' });
    }

    summoner.nickname = summonerName ?? summoner.nickname;
    summoner.summonerLevel = summonerLevel ?? summoner.summonerLevel;

    const [, error] = await prettifyPromise(summonerRepository.save(summoner));

    if (error) {
      console.error(error.stack);
      return response.status(500).json({ error: 'Erro ao salvar alterações no summoner' });
    }

    return response.json(summoner);
  }

  static async delete(request: AuthenticatedRequest, response: Response) {
    const { id } = request.params;

    const summonerRepository = getRepository(Summoner);

    await summonerRepository.delete({ id, user: { id: request.userId } });

    return response.json({ message: 'successfully deleted' });
  }

  static async export(request: AuthenticatedRequest, response: Response) {
    const summonerRepository = getRepository(Summoner);

    const [summoners, findSummonersError] = await prettifyPromise(
      summonerRepository.find({
        where: {
          user: {
            id: request.userId,
          },
        },
      }),
    );

    if (findSummonersError) {
      console.error(findSummonersError.stack);
      return response.status(500).json({ error: 'Erro ao buscar summoners' });
    }

    const exportFile = exportSummonersToXlsx(summoners);

    return response
      .header({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=summoners.xlsx',
      })
      .send(exportFile);
  }
}