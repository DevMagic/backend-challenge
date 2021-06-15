import express, { json } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { routes } from './routes.js';

const server = express();

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.use(json());
server.use(routes);

server.listen(process.env.PORT || 3001);
