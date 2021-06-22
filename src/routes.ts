import { Router } from 'express';

import authenticatedRoutes from './authenticatedRoutes';
import UserController from './controllers/UserController';

const routes = Router();

routes.post('/users', UserController.create);
routes.post('/login', UserController.authenticate);

routes.use(authenticatedRoutes);

export default routes;