import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { Request, Response, NextFunction } from 'express';
import { findId } from '../repository/userRepository';

export function authenticate(options = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await findId(userId);
      if (!user && !options.optional) {
        res.status(401).json({ message: 'Unauthorized -User not found' });
        return;
      }
      req.user = user ?? undefined;
    } catch (error) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };
}

export default authenticate;
