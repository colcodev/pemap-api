import { ValidationError } from 'express-validation';
import createError from 'http-errors';

import logger from './logger';

export const handleNotFound = (req, res, next) => next(createError(404, 'Recurso no encontrado.'));

// eslint-disable-next-line no-unused-vars
export const handleOtherErrors = (err, req, res, next) => {
  let errStatus = err.status || 500;
  let errMessage = err.message || 'Error interno. Inténtalo nuevamente más tarde.';

  if (err instanceof ValidationError) {
    errStatus = err.statusCode;
    errMessage = 'Error de validación.';
  } else if (err.response) {
    errStatus = err.response.status;
    errMessage = err.response.message;

    if (err.response.data) {
      if (err.response.data.code === 'USR_INVALID_CREDENTIALS') {
        errStatus = 401;
        errMessage = 'Datos de ingreso inválidos. Inténtalo nuevamente.';
      } else if (err.response.data.code === 'INVALID_TOKEN') {
        errStatus = 401;
        errMessage = 'Ocurrió un error. Inténtalo nuevamente más tarde.';
      }
    }
  }

  const response = {
    status: errStatus,
    message: errMessage,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    logger.error('App Error: ', err);
  }

  res.status(errStatus).json(response);
};

export default { handleNotFound, handleOtherErrors };
