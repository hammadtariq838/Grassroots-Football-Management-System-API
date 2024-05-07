import { Request, Response, NextFunction } from 'express';
import { NFE404 } from '../error';
import { ErrorResponse } from '../types';

export const unknownEndpointHandler = (req: Request, _: Response, next: NextFunction): void => {
  next(new NFE404(`Unknown endpoint ${req.method} ${req.path}`));
}

export const errorHandler = (error: unknown, _: Request, res: Response, __: NextFunction): void => {
  const response: ErrorResponse = {
    success: false,
    message: 'Internal Server Error',
    error: error
  }
  res.status(500).json(response);
}
