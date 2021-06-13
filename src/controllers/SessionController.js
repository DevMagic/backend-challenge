import User from '../models/User.js';
import crypto from 'crypto';

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    let user = await User.findOne({ email });

    const salt = crypto.randomBytes(16).toString('hex');

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
    }

    return response.json(user);
  },
};
