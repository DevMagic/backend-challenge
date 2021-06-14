import User from '../models/User.js';
import crypto from 'crypto';
import 'dotenv/config';

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    const salt = process.env.SALT;
    const hash = crypto
      .pbkdf2Sync(password, salt, 128, 16, `sha512`)
      .toString(`hex`);

    let user = await User.findOne({ email, password: hash });

    if (!user && name.length > 0 && password.length > 8) {
      user = await User.create({
        _id: crypto.randomUUID(),
        name,
        email,
        password: hash,
      });
    } else if (user) {
      return response.status(200).json(user);
    } else {
      return response.status(400).json({ error: 'Erro' });
    }
    return response.status(201).json(user);
  },
};
