import { afterEach, before, describe, it } from 'mocha'
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

import { Request, Response } from 'express'

import * as typeorm from 'typeorm'
import * as hashPassword from '../../src/utils/hashPassword';
import * as accessToken from '../../src/utils/accessToken';

import UserController from '../../src/controllers/UserController';
import { User } from '../../src/entity/User';

function createMockRequest(data: Partial<Request>) {
  return data as Request;
}

function createMockResponse(sandbox: SinonSandbox) {
  const response: { [P in keyof Response]?: SinonStub } = {};

  response.status = sandbox.stub().returns(response);
  response.send = sandbox.stub().returns(response);
  response.json = sandbox.stub().returns(response);

  return response;
}

describe('UserController', () => {
  let sandbox: SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('create', () => {
    it('should return status 409 if user email already exists', async () => {
      const userData = {
        name: "gabriel",
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOne: sandbox.stub().resolves({ email: userData.email }),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);

      await UserController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(409)).to.be.ok;
    });

    it('should return status 400 if name is not sent', async () => {
      const userData = {
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOne: sandbox.stub().resolves(null),
        save: sandbox.stub().rejects(Error('sql error: user.name cannot be null'))
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(hashPassword, 'generateHashedPassword').resolves('fakepasswordhash');

      await UserController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(400)).to.be.ok;
    });

    it('should return status 400 if password is not sent', async () => {
      const userData = {
        name: 'gabriel',
        email: "gabriel@gabriel.com",
      }

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOne: sandbox.stub().resolves(null),
        save: sandbox.stub().resolves({ id: 'fakeId', ...userData })
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(hashPassword, 'generateHashedPassword').rejects(new Error('hash password error'));

      await UserController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(400)).to.be.ok;
    });

    it('should return status 201 and user data with generated id and hashed password', async () => {
      const userData = {
        name: "gabriel",
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const fakeGeneratedId = 'fakegeneratedid';
      const fakeHashedPassword = 'fakehashedpassword';

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOne: sandbox.stub().resolves(null),
        save: sandbox.stub().resolves({
          id: fakeGeneratedId,
          ...userData,
          password: fakeHashedPassword,
        }),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(hashPassword, 'generateHashedPassword').resolves(fakeHashedPassword);

      await UserController.create(request, response as unknown as Response);

      expect(response.status.calledOnceWith(201)).to.be.true;

      expect(response.json.calledOnceWith({
        id: fakeGeneratedId,
        ...userData,
        password: fakeHashedPassword,
      })).to.be.true;
    });
  });

  describe('login', () => {
    it('should return status 404 if user email does not exist', async () => {
      const userData = {
        name: "gabriel",
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOneOrFail: sandbox.stub().rejects(new Error()),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);

      await UserController.authenticate(request, response as unknown as Response);

      expect(response.status.calledOnceWith(404)).to.be.ok;
    });

    it('should return status 403 if password is wrong', async () => {
      const userData = {
        name: "gabriel",
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOneOrFail: sandbox.stub().returns({ ...userData, password: 'differentpassword' }),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(hashPassword, 'compareHashedPassword').resolves(false);

      await UserController.authenticate(request, response as unknown as Response);

      expect(response.status.calledOnceWith(403)).to.be.ok;
    });

    it('should return jwt token if credentials are correct', async () => {
      const userData = {
        name: "gabriel",
        email: "gabriel@gabriel.com",
        password: "1213141516",
      }

      const fakeJwt = 'fakejwt';

      const request = createMockRequest({
        body: userData,
      });

      const response = createMockResponse(sandbox);

      const fakeUserRepository = {
        findOneOrFail: sandbox.stub().returns({ id: 'fakeid', userData}),
      } as unknown as typeorm.Repository<User>;

      sandbox.stub(typeorm, 'getRepository').returns(fakeUserRepository);
      sandbox.stub(hashPassword, 'compareHashedPassword').resolves(true);
      sandbox.stub(accessToken, 'generateAccessToken').resolves(fakeJwt);

      await UserController.authenticate(request, response as unknown as Response);

      expect(response.json.calledOnceWith({ token: fakeJwt })).to.be.ok;
    });
  });
});