import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

export default mongoose.model('User', UserSchema);
