import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/accessToken';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

async function authenticationMiddleware(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Não foi enviado token de autenticação' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!scheme || !token || !/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Token de autenticação com formato inválido' });
  }

  const decoded = await verifyAccessToken<{ id: string }>(token);

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.userId = decoded.id;

  return next();
}

export default authenticationMiddleware;