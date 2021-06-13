import { Router } from 'express';
import SessionController from './controllers/SessionController.js';

const routes = Router();

routes.post('/sessions', SessionController.create);

export { routes };
