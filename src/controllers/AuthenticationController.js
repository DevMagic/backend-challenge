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

    try {
      const secret = process.env.SECRET_KEY;
      const hash = verifyPassword(password, secret);
      const user = await User.findOne({ name, email, password: hash });

      if (
        name === user.name &&
        email === user.email &&
        hash === user.password
      ) {
        const { _id } = user;
        const token = jwt.sign({ _id }, process.env.SECRET_KEY, {
          expiresIn: 60 * 60 * 24, // expires in 24h
        });

        return response.status(200).json({ token });
      } else if (!user) {
        return response.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return response
        .status(400)
        .json({ error, type: 'Error authenticating user' });
    }
  },
};
