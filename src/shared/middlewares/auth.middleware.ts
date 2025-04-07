import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { config } from '@config';
import { AppError } from '@shared/errors';

interface ITokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, 'Token not provided');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, config.jwtSecret) as ITokenPayload;

    if (!decoded) {
      throw new AppError(401, 'Unauthorized');
    }

    return next();
  } catch {
    throw new AppError(401, 'Invalid token');
  }
};
