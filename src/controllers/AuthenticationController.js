import User from '../models/User.js';
import 'dotenv/config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function verifyPassword(itemToHash, secretKey) {
  const secret = secretKey;

  const hash = crypto
    .pbkdf2Sync(itemToHash, secret, 128, 16, `sha512`)
    .toString(`hex`);
  return hash;
}

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    const secret = process.env.SECRET_KEY;
    const hash = verifyPassword(password, secret);

    const {
      name: DB_NAME,
      email: DB_EMAIL,
      password: DB_PASSWORD,
      _id,
    } = await User.findOne({ name, email, password: hash });

    if (name === DB_NAME && email === DB_EMAIL && hash === DB_PASSWORD) {
      const token = jwt.sign({ _id }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24, // expires in 24h
      });

      return response.json({ _id, token });
    }

    // const { data } = await api.get(
    //   `/lol/summoner/v4/summoners/by-name/OldWolfKing?api_key=${token}`,
    // );

    return response.json({ message: 'User not found' });
  },
};
