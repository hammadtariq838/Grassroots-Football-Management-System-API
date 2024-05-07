import { Request, Response, NextFunction } from 'express';
import { NFE404, ApplicationError } from '../error';
import { ErrorResponse } from '../types';

export const unknownEndpointHandler = (req: Request, _: Response, next: NextFunction): void => {
  next(new NFE404(`Unknown endpoint ${req.method} ${req.path}`));
}

const errorTypeGuard = (error: unknown): error is ApplicationError => {
  if (
    (error as ApplicationError).name &&
    (error as ApplicationError).message &&
    (error as ApplicationError).statusCode
  ) {
    return true;
  } else {
    return false;
  }
}



export const errorHandler = (error: unknown, _: Request, res: Response, __: NextFunction): void => {
  if (errorTypeGuard(error)) {
    const { message, statusCode } = error;
    const response: ErrorResponse = {
      success: false,
      message,
      error
    };
    // logger.error(response)
    res.status(statusCode).json(response);
  } else {
    const response: ErrorResponse = {
      success: false,
      message: 'An unexpected error occurred',
      error: error
    };
    res.status(500).json(response);
  }
}