import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
});

export default mongoose.model('User', UserSchema);
