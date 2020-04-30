import mongoose from 'mongoose';

import logger from './logger';

// retry connection
const connectWithRetry = () =>
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

// exit application on error
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', err);
  setTimeout(connectWithRetry, 5000);
  process.exit(-1);
});

mongoose.connection.on('connected', () => logger.info('MongoDB connected'));

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const connect = () => {
  connectWithRetry();
};

export default { connect };
