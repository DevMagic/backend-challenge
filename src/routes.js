import { Router } from 'express';
import SessionController from './controllers/SessionController.js';
import AuthenticationController from './controllers/AuthenticationController.js';
import SummonerController from './controllers/SummonerController.js';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'server online' });
});

routes.post('/signup', SessionController.create);
routes.post('/login', AuthenticationController.create);

routes.post('/summoners', SummonerController.create);
routes.get('/summoners', SummonerController.index);

export { routes };
