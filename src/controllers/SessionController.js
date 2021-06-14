import User from '../models/User.js';
import crypto from 'crypto';
import 'dotenv/config';

function generateHashPwd(password) {
  const secret = process.env.SECRET_KEY;
  const hash = crypto
    .pbkdf2Sync(password, secret, 128, 16, `sha512`)
    .toString(`hex`);

  return hash;
}

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    const hash = generateHashPwd(password);

    let user = await User.findOne({ email, password: hash });

    try {
      if (!user && name.length > 0 && password.length > 8) {
        user = await User.create({
          _id: crypto.randomUUID(),
          name,
          email,
          password: hash,
        });

        return response.status(201).json(user);
      } else if (user) {
        return response.status(400).json({ error: 'User already exists' });
      }
    } catch (error) {
      return response.status(400).json({ error });
    }
  },
};
