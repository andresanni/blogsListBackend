const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path  :', req.path);
  logger.info('Body  :', req.body);
  if(req.method !== 'GET'){
    logger.info('Token:' ,req.headers['authorization'])
  }
  logger.info('---');
  next();
};

const tokenExtractor = (request, res, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer')) {
    request.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = (request, response, next) => {
  const { token } = request;

  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken) {
      request.user = decodedToken;
    }
  }

  next();
};

//TODO
const errorHandler = (error, req, res, next) => {
  logger.error(error.name);
  if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  }
};
//TODO
const unknownEndpoint = (req, res) => {};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
};
