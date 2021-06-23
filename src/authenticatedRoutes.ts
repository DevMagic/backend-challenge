import { Router } from 'express'

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import SummonerController from './controllers/SummonerController';

const authenticatedRoutes = Router();

authenticatedRoutes.use(authenticationMiddleware);

authenticatedRoutes.get('/summoners', SummonerController.index);
authenticatedRoutes.get('/summoners/detail', SummonerController.detail);
authenticatedRoutes.post('/summoners', SummonerController.create);
authenticatedRoutes.put('/summoners/:id', SummonerController.update);
authenticatedRoutes.delete('/summoners/:id', SummonerController.delete);
authenticatedRoutes.get('/summoners/export', SummonerController.export);

export default authenticatedRoutes;