const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const blogRouter = require('./controller/blogs');
const userRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const testingRouter = require('./controller/testing');
const {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware');
const mongoUrl = config.MONGO_URI;

logger.info(`connecting to ${mongoUrl}`);

mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(tokenExtractor);
app.use('/api/blogs', userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(errorHandler);

module.exports = app;
