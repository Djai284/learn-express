import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { User, UserRequest } from './types';
import readRouter from './readUsers';
import writeRouter from './writeUsers';

const app = express();
const port = 8000;
const dataFile = '../data/users.json';

// Global users variable
let users: User[];

// Read initial user data
fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data.toString());
});

// Middleware to add users to request object
const addUsersToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

// Configure middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers with their respective paths and middleware
app.use('/read', addUsersToRequest, readRouter);
app.use('/write', addUsersToRequest, writeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});