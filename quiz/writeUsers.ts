import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { User, UserRequest } from './types';

const router = express.Router();

const dataFile = '../data/users.json';

// Middleware to check if users exist
const addMsgToRequest = (req: UserRequest, res: Response, next: express.NextFunction) => {
  if (req.users) {
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

// Add new user
router.post('/adduser', addMsgToRequest, (req: UserRequest, res: Response) => {
  let newuser = req.body as User;
  if (req.users) {
    req.users.push(newuser);
    fs.writeFile(path.resolve(__dirname, dataFile), JSON.stringify(req.users), (err) => {
      if (err) {
        console.log('Failed to write');
        res.status(500).json({
          error: { message: 'Failed to save user', status: 500 }
        });
      } else {
        console.log('User Saved');
        res.send('done');
      }
    });
  }
});

export default router;