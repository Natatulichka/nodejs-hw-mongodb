import express from 'express';
import cors from 'cors';
import env from './utils/env.js';
import pinoHttp from 'pino-http';

import greetingsRouter from './routers/greetings.js';
import contactRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { auth } from './middlewares/auth.js';

import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(cookieParser());

  app.use(greetingsRouter);
  app.use('/auth', authRoutes);
  app.use('/contacts', auth, contactRoutes);

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
export default setupServer;
