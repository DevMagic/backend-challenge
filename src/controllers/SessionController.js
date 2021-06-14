import User from '../models/User.js';
import crypto from 'crypto';
import 'dotenv/config';

export default {
  async create(request, response) {
    const { name, email, password } = request.body;
    const salt = process.env.SALT;

    let user = await User.findOne({ email });

    const hash = crypto
      .pbkdf2Sync(password, salt, 128, 16, `sha512`)
      .toString(`hex`);

    const _id = crypto.randomUUID();

    if (!user && name.length > 0 && password.length > 8) {
      user = await User.create({
        _id,
        name,
        email,
        password: hash,
      });
    } else if (user) {
      return response.status(200).json(user);
    } else {
      const error = 'Verify your data';
      return response.status(400).json({ error });
    }

    return response.status(201).json(user);
  },
};
