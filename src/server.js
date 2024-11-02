import express from 'express';
import cors from 'cors';
import env from './utils/env.js';
import pinoHttp from 'pino-http';
import contactRoutes from './routers/contacts.js';
import greetingsRouter from './routers/greetings.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));
const setupServer = () => {
  const app = express();

  app.use('/contacts', contactRoutes);
  app.use(greetingsRouter);
  app.use(cors());

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
export default setupServer;
