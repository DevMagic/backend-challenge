import { Router } from 'express';

import authenticatedRoutes from './authenticatedRoutes';
import UserController from './controllers/UserController';

const routes = Router();

routes.post('/users', UserController.create);

export default routes;