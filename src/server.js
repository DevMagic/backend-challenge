import express from 'express';

const server = express();

server.get('/', (request, response) => {
  response.send('Hello World');
});

server.listen(process.env.PORT || 3000);
