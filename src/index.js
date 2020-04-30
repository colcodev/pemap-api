// load env vars
import 'dotenv/config';

import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { handleNotFound, handleOtherErrors } from './helpers/apiErrors';
import database from './helpers/database';
import logger from './helpers/logger';
import v1Routes from './routes/v1';

// connect to database
database.connect();

// start express app
const app = express();

// only use morgan for development environments
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// middleawares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// enable CORS pre-flights
app.options('*', cors());

// api v1 routes
app.use('/v1', v1Routes);

// error handlers
app.use(handleNotFound);
app.use(handleOtherErrors);

// only use this error handler for non development environment
if (process.env.NODE_ENV === 'development') app.use(errorHandler());

// output all uncaught exceptions
process.on('uncaughtException', (err) => logger.error('uncaught exception: ', err));
process.on('unhandledRejection', (err) => logger.error('unhandled rejection: ', err));

// start server
app.server = app.listen(process.env.PORT);
logger.info(`Server running on port ${process.env.PORT}`);

export default app;
