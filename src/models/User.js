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
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
