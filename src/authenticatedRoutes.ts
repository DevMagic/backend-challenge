import { Router } from 'express'

import authenticationMiddleware from './middlewares/authenticationMiddleware';

const authenticatedRoutes = Router();

authenticatedRoutes.use(authenticationMiddleware);

authenticatedRoutes.get('/', (req, res) => {
  return res.send('test');
})

export default authenticatedRoutes;