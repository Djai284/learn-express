import express, { Response, Request } from 'express';
import { User, UserRequest } from './types';

const router = express.Router();

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

// Get all usernames
router.get('/usernames', addMsgToRequest, (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

// Get specific user by username
router.get('/username/:name', addMsgToRequest, (req: UserRequest, res: Response) => {
  const username = req.params.name;
  const user = req.users?.find(user => user.username === username);
  
  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({
      error: { message: 'User not found', status: 404 }
    });
  }
});

export default router;