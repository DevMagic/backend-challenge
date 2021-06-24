import jwt from 'jsonwebtoken';

import { User } from '../entity/User';

function jwtSignPromise(
  payload: string | object | Buffer,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })
  })
}

function jwtVerifyPromise<T = unknown>(
  token: string,
  secretOrPublicKey: jwt.Secret,
  options?: jwt.VerifyOptions & { complete: true; }): Promise<jwt.Jwt & T> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded as jwt.Jwt & T);
      }
    });
  })
}

export async function generateAccessToken({ id }: User) {
  const token = await jwtSignPromise({ id }, process.env.JWT_SECRET);

  return token;
}

export async function verifyAccessToken<T = unknown>(token: string) {
  const decoded = await jwtVerifyPromise<T>(token, process.env.JWT_SECRET);

  return decoded;
}
