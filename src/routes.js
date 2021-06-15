import { Router } from 'express';
import UserController from './controllers/UserController.js';
import AuthenticationController from './controllers/AuthenticationController.js';
import SummonerController from './controllers/SummonerController.js';
import PlayerController from './controllers/PlayerController.js';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'server online' });
});

routes.post('/signup', UserController.create);

routes.post('/login', AuthenticationController.create);

routes.post('/summoners', SummonerController.create);
routes.get('/summoners', SummonerController.index);

routes.get('/infos', PlayerController.index);
routes.put('/infos', PlayerController.update);
routes.delete('/infos', PlayerController.delete);

export { routes };
