import { Request, Response, NextFunction } from 'express';
export * from './errorHandler'


export const authEnabler = (req: Request, _: Response, next: NextFunction) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
}

