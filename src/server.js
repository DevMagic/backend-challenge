import express, { json } from 'express';
import mongoose from 'mongoose';
import { routes } from './routes.js';
import 'dotenv/config';

const server = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.use(json());
server.use(routes);

server.listen(process.env.PORT || 3000);
