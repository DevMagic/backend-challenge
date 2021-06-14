import User from '../models/User.js';
import 'dotenv/config';
import crypto from 'crypto';

function verifyPassword(password, userSalt) {
  const salt = userSalt;

  const hash = crypto
    .pbkdf2Sync(password, salt, 128, 16, `sha512`)
    .toString(`hex`);
  return hash;
}

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    const {
      name: DB_NAME,
      email: DB_EMAIL,
      password: DB_PASSWORD,
    } = await User.findOne({ name, email });

    const salt = process.env.SALT;

    const hash = verifyPassword(password, salt);

    // const token = request.headers['x-riot-token'];

    if (name === DB_NAME && email === DB_EMAIL && hash === DB_PASSWORD) {
      const token = process.env.API_TOKEN;
      return response.json({ token });
    }

    // const { data } = await api.get(
    //   `/lol/summoner/v4/summoners/by-name/OldWolfKing?api_key=${token}`,
    // );

    return response.json({ message: 'User not found' });
  },
};
