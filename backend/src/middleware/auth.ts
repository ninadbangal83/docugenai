import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel.js';

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(401).send({ status: 'failed', message: 'Authorization header missing' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      res.status(401).send({ status: 'failed', message: 'User not found' });
      return;
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ status: 'failed', message: 'Please authenticate.' });
  }
};

export default auth;
