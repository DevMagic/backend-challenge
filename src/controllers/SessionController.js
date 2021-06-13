import User from '../models/User.js';
import crypto from 'crypto';

export default {
  async create(request, response) {
    const { name, email, password } = request.body;

    let user = await User.findOne({ email });

    if (!user && name.length > 0 && password.length > 8) {
      user = await User.create({
        id: crypto.randomBytes(16).toString('hex'),
        email,
        name,
        password,
      });
    }

    return response.json(user);
  },
};
