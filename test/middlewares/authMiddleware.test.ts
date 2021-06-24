import { afterEach, before, describe, it } from 'mocha';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';

import { Request, Response } from 'express'

import authenticationMiddleware from '../../src/middlewares/authenticationMiddleware';
import * as accessToken from '../../src/utils/accessToken';
import { Jwt } from 'jsonwebtoken';

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

function createMockNextFunction(sandbox: SinonSandbox) {
  return sandbox.stub();
}

describe('AuthenticationMiddleware', () => {
  let sandbox: SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return status 401 if no auth token is sent', async () => {
    const request = createMockRequest({
      headers: {},
    });
    const response = createMockResponse(sandbox);
    const next = createMockNextFunction(sandbox);

    await authenticationMiddleware(request, response as unknown as Response, next);

    expect(response.status.calledOnceWith(401)).to.be.ok;
  });

  it('should return status 401 if auth token is in wrong format', async () => {
    const request = createMockRequest({
      headers: {
        authorization: 'invalidtoken',
      },
    });
    const response = createMockResponse(sandbox);
    const next = createMockNextFunction(sandbox);

    await authenticationMiddleware(request, response as unknown as Response, next);

    expect(response.status.calledOnceWith(401)).to.be.ok;
  });

  it('should return status 401 if auth token is invalid', async () => {
    const request = createMockRequest({
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });
    const response = createMockResponse(sandbox);
    const next = createMockNextFunction(sandbox);

    sandbox.stub(accessToken, 'verifyAccessToken').rejects(new Error());

    await authenticationMiddleware(request, response as unknown as Response, next);

    expect(response.status.calledOnceWith(401)).to.be.ok;
  });

  it('should call the next function if token is valid', async () => {
    const request = createMockRequest({
      headers: {
        authorization: 'Bearer validtoken',
      },
    });
    const response = createMockResponse(sandbox);
    const next = createMockNextFunction(sandbox);

    sandbox.stub(accessToken, 'verifyAccessToken').resolves({ id: 'validuserid' } as unknown as Jwt);

    await authenticationMiddleware(request, response as unknown as Response, next);

    expect(next.called).to.be.ok;
  });
});