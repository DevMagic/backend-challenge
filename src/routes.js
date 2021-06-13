import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  response.send('Hello');
});

export { routes };
