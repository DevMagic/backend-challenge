import { Router } from 'express';
import UserController from './controllers/UserController.js';
import AuthenticationController from './controllers/AuthenticationController.js';
import SummonerController from './controllers/SummonerController.js';
import PlayerController from './controllers/PlayerController.js';

const routes = Router();

routes.post('/signup', UserController.create);

routes.post('/login', AuthenticationController.create);

routes.post('/summoners', SummonerController.create);
routes.get('/summoners', SummonerController.index);

routes.get('/players', PlayerController.index);
routes.put('/players', PlayerController.update);
routes.delete('/players', PlayerController.delete);
routes.post('/players', PlayerController.export);

export { routes };
