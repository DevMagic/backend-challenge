import { Router } from 'express';
import SessionController from './controllers/SessionController.js';
import AuthenticationController from './controllers/AuthenticationController.js';
import SummonerController from './controllers/SummonerController.js';

const routes = Router();

routes.post('/sessions', SessionController.create);

routes.post('/authentications', AuthenticationController.create);

routes.post('/summoners', SummonerController.create);

export { routes };
