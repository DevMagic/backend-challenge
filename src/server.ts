import 'dotenv/config';
import { createConnection } from 'typeorm';

import createApp from './app';

(async () => {
  await createConnection();
  
  const app = createApp();
  app.listen(3333);
})();