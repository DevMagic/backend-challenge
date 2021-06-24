import { afterEach, before, describe, it } from 'mocha';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

import { Request, Response } from 'express'

import * as typeorm from 'typeorm'
import riotApi from '../../src/services/riotApi';
import { expect } from 'chai';
import SummonerController from '../../src/controllers/SummonerController';
import { AuthenticatedRequest } from '../../src/middlewares/authenticationMiddleware';
import { User } from '../../src/entity/User';
import { Summoner } from '../../src/entity/Summoner';
import * as exportSummonersToXlsx from '../../src/utils/exportSummonersToXlsx';

function createMockRequest(data: Partial<Request>) {
  return { ...data, userId: 'fakeuserid' } as Request as AuthenticatedRequest;
}

function createMockResponse(sandbox: SinonSandbox) {
  const response: { [P in keyof Response]?: SinonStub } = {};

  response.status = sandbox.stub().returns(response);
  response.send = sandbox.stub().returns(response);
  response.json = sandbox.stub().returns(response);
  response.header = sandbox.stub().returns(response);

  return response;
}

describe('SummonerController', () => {
  let sandbox: SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {
    it('should return status 500 if riot api returns an error', async () => {
      const summonerName = 'OldWolfKing';

      const request = createMockRequest({
        body: {
          summonerName,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOneOrFail: sandbox.stub().resolves({ id: request.userId }),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(riotApi, 'get').rejects(new Error());

      await SummonerController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return status 404 if riot api does not find summoner', async () => {
      const summonerName = 'OldWolfKing';

      const request = createMockRequest({
        body: {
          summonerName,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOneOrFail: sandbox.stub().resolves({ id: request.userId }),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(riotApi, 'get').rejects({ response: { status: 404 } });

      await SummonerController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(404)).to.be.ok;
    });

    it('should return status 409 if already exists a summoner with same accountId or summonerId', async () => {
      const summonerName = 'OldWolfKing';

      const summonerData = {
        id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM',
        accountId: 'V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw',
        puuid: '5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q',
        name: 'Old Wolf King',
        profileIconId: 4864,
        revisionDate: 1613316510000,
        summonerLevel: 225
      }

      const request = createMockRequest({
        body: {
          summonerName,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeRepositories = new Map<any, typeorm.Repository<any>>();

      fakeRepositories.set(
        User,
        {
          findOneOrFail: sandbox.stub().resolves({ id: request.userId }),
        } as unknown as typeorm.Repository<User>,
      );

      fakeRepositories.set(
        Summoner,
        {
          findOne: sandbox.stub().resolves(summonerData),
          save: sandbox.stub().resolves(summonerData),
        } as unknown as typeorm.Repository<Summoner>,
      );

      sandbox.stub(typeorm, 'getRepository').callsFake((entityClass: unknown) => fakeRepositories.get(entityClass));
      sandbox.stub(riotApi, 'get').resolves({ data: summonerData });

      await SummonerController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(409)).to.be.ok;
    });

    it('should return status 201 if summoner is successfully created', async () => {
      const summonerName = 'OldWolfKing';

      const summonerData = {
        id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM',
        accountId: 'V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw',
        puuid: '5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q',
        name: 'Old Wolf King',
        profileIconId: 4864,
        revisionDate: 1613316510000,
        summonerLevel: 225
      }

      const request = createMockRequest({
        body: {
          summonerName,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeRepositories = new Map<any, typeorm.Repository<any>>();

      fakeRepositories.set(
        User,
        {
          findOneOrFail: sandbox.stub().resolves({ id: request.userId }),
        } as unknown as typeorm.Repository<User>,
      );

      fakeRepositories.set(
        Summoner,
        {
          findOne: sandbox.stub().resolves(null),
          save: sandbox.stub().resolves(summonerData),
        } as unknown as typeorm.Repository<Summoner>,
      );

      sandbox.stub(typeorm, 'getRepository').callsFake((entityClass: unknown) => fakeRepositories.get(entityClass));
      sandbox.stub(riotApi, 'get').resolves({ data: summonerData });

      await SummonerController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(201)).to.be.ok;
    });
  });

  describe('list', () => {
    it('should return status 500 if the query fails', async () => {
      const request = createMockRequest({});

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        find: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.index(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return summoners list correctly', async () => {
      const fakeSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I4",
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I4",
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I4",
        },
      ];

      const request = createMockRequest({});
      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        find: sandbox.stub().resolves(fakeSummonersList),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.index(request, response as unknown as Response);

      expect(response.json.calledOnceWith(fakeSummonersList)).to.be.ok;
    });
  });

  describe('detailed list', () => {
    it('should return status 500 if the query fails', async () => {
      const request = createMockRequest({});
      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        find: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.detail(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return status 500 if riot api returns error', async () => {
      const fakeSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I4",
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I4",
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I4",
        },
      ];

      const request = createMockRequest({});
      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        find: sandbox.stub().resolves(fakeSummonersList),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);
      sandbox.stub(riotApi, 'get').rejects(new Error());

      await SummonerController.detail(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return detailed summoner data', async () => {
      const fakeSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I41",
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I42",
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I43",
        },
      ];

      const fakeSummonersRankedDetails = {
        'V94KgBnbbsaR4I41': [
          { wins: 2, losses: 45 },
          { wins: 0, losses: 55 },
        ],
        'V94KgBnbbsaR4I42': [
          { wins: 6, losses: 2 },
          { wins: 6, losses: 1 },
        ],
        'V94KgBnbbsaR4I43': [
          { wins: 3, losses: 4 },
          { wins: 4, losses: 3 },
        ],
      }

      const fakeDetailedSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I41",
          wins: 2,
          losses: 100,
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I42",
          wins: 12,
          losses: 3,
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I43",
          wins: 7,
          losses: 7,
        },
      ];

      const request = createMockRequest({});
      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        find: sandbox.stub().resolves(fakeSummonersList),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);
      sandbox.stub(riotApi, 'get').callsFake(async url => {
        const splitUrl = url.split('/');
        const summonerId = splitUrl[splitUrl.length - 1];

        return {
          data: fakeSummonersRankedDetails[summonerId]
        };
      });

      await SummonerController.detail(request, response as unknown as Response);

      expect(response.json.calledOnceWith(fakeDetailedSummonersList)).to.be.ok;
    });
  });

  describe('update', () => {
    it('should return status 404 if summoner is not found', async () => {
      const request = createMockRequest({
        params: { id: 'fakeid' },
        body: {
          summonerName: 'OldWolfKingMaster',
          summonerLevel: 550,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        findOneOrFail: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.update(request, response as unknown as Response);

      expect(response.status.calledOnceWith(404)).to.be.ok;
    });

    it('should return status 500 if update query fails', async () => {
      const summonerData = {
        id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM',
        accountId: 'V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw',
        puuid: '5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q',
        nickname: 'Old Wolf King',
        profileIconId: 4864,
        revisionDate: 1613316510000,
        summonerLevel: 225
      }

      const request = createMockRequest({
        params: { id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM' },
        body: {
          summonerName: 'OldWolfKingMaster',
          summonerLevel: 550,
        },
      });

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        findOneOrFail: sandbox.stub().resolves(summonerData),
        save: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.update(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return updated summoner', async () => {
      const summonerData = {
        id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM',
        accountId: 'V94KgBnbbsaR4I4MXXX4trfyvUay95h_13PCsTz6jo4ByBw',
        puuid: '5LwdLcx1qM2_E-1NNFTBRDgTK6oqvc3XXXmbC4gqNauImdGCIm3WM2RZLBNcIyui-sXc2Q',
        nickname: 'Old Wolf King',
        profileIconId: 4864,
        revisionDate: 1613316510000,
        summonerLevel: 225
      }

      const updatedSummonerData = {
        summonerName: 'OldWolfKingMaster',
        summonerLevel: 550,
      };

      const request = createMockRequest({
        params: { id: 'OtaV_QBRbtzt7DtXXXlXbvRjuDmDRZJ38wjbEQOqXbM' },
        body: updatedSummonerData,
      });

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        findOneOrFail: sandbox.stub().resolves(summonerData),
        save: sandbox.stub().resolves(summonerData),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.update(request, response as unknown as Response);

      expect(response.json.calledOnceWith({
        ...summonerData,
        nickname: updatedSummonerData.summonerName,
        summonerLevel: updatedSummonerData.summonerLevel,
      })).to.be.ok;
    });
  });

  describe('delete', () => {
    it('should return status 500 if query fails', async () => {
      const request = createMockRequest({
        params: { id: 'fakeid' },
      });

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        delete: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.delete(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return json with property message: "successfully deleted"', async () => {
      const request = createMockRequest({
        params: { id: 'fakeid' },
      });

      const response = createMockResponse(sandbox);

      const fakeSummonerRepository = {
        delete: sandbox.stub().resolves(),
      } as unknown as typeorm.Repository<Summoner>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);

      await SummonerController.delete(request, response as unknown as Response);

      expect(response.json.calledOnceWith({ message: 'successfully deleted' })).to.be.ok;
    });
  });

  describe('export', () => {
    it('should return status 500 if find query fails', async () => {
      const fakeSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I41",
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I42",
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I43",
        },
      ];
  
      const fakeExportFile = new ArrayBuffer(5);
      
      const request = createMockRequest({});
  
      const response = createMockResponse(sandbox);
  
      const fakeSummonerRepository = {
        find: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<Summoner>;
  
      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);
      sandbox.stub(exportSummonersToXlsx, 'default').returns(fakeExportFile);

      await SummonerController.export(request, response as unknown as Response);

      expect(response.status.calledOnceWith(500)).to.be.ok;
    });

    it('should return generated xlsx file with correct headers', async () => {
      const fakeSummonersList = [
        {
          id: "1",
          nickname: "Old Wolf King",
          accountId: "V94KgBnbbsaR4I4",
          summonerLevel: "100",
          profileIconId: "4864",
          summonerId: "V94KgBnbbsaR4I41",
        },
        {
          id: "2",
          nickname: "Old Wolf King",
          accountId: "bsaR4I4V94KgBnb",
          summonerLevel: "150",
          profileIconId: "4684",
          summonerId: "V94KgBnbbsaR4I42",
        },
        {
          id: "3",
          nickname: "Old Wolf King",
          accountId: "4I4V94KgbsaRBnb",
          summonerLevel: "500",
          profileIconId: "4648",
          summonerId: "V94KgBnbbsaR4I43",
        },
      ];
  
      const fakeExportFile = new ArrayBuffer(5);

      const expectedHeaders = {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=summoners.xlsx',
      };
      
      const request = createMockRequest({});
  
      const response = createMockResponse(sandbox);
  
      const fakeSummonerRepository = {
        find: sandbox.stub().returns(fakeSummonersList),
      } as unknown as typeorm.Repository<Summoner>;
  
      sandbox.stub(typeorm, 'getRepository').returns(fakeSummonerRepository);
      sandbox.stub(exportSummonersToXlsx, 'default').returns(fakeExportFile);

      await SummonerController.export(request, response as unknown as Response);

      expect(response.header.calledOnceWith(expectedHeaders)).to.be.ok;
      expect(response.send.calledOnceWith(fakeExportFile)).to.be.ok;
    });
  });
});