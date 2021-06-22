import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { generateAccessToken } from '../utils/accessToken';
import { generateHashedPassword } from '../utils/hashPassword';
import prettifyPromise from '../utils/prettifyPromise';

export default class UserController {
  static async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const userRepository = getRepository(User);

    const hashedPassword = await generateHashedPassword(password);

    const [user, error] = await prettifyPromise(userRepository.save({ name, email, password: hashedPassword }));

    if (error) {
      console.error(error.stack);
      return response.status(400).json({ error: 'Erro ao criar usuário' });
    }

    return response.json(user);
  }

}