import express from 'express';
import { routes } from './routes.js';

const server = express();

server.use(routes);

server.listen(process.env.PORT || 3000);
