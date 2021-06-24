import express from 'express';

import routes from './routes';

export default function createApp() {
  const app = express();
  
  app.use(express.json());
  
  app.use(routes);
  
  return app;
}
