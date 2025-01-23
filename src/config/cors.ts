import cors from 'cors';
import { env } from '../env';
import { Application } from 'express';
import logger from './logger';

const configureCORS = (app: Application) => {
  const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = env.ALLOWED_ORIGINS;
      const origins = allowedOrigins.split(" ");
      if (origins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Request from unauthorized origin"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  logger.info('Cors has been enabled');
};

export default configureCORS;
