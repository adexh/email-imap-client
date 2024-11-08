import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import * as middlewares from './middlewares';
import { Routers } from './app/routes';
import session from "express-session";
import { User } from "shared-types";
import RedisStore from "connect-redis"
import {redisClient} from "./infrastructure/redis";
import expressWinston from 'express-winston';
import logger from './utils/logger';

redisClient.connect().then(data=> console.log('Redis connect success')
).catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

dotenv.config();

const app = express();

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  store: redisStore,
  secret: process.env.AUTH_SECRET as string,
  saveUninitialized: false,
  resave: false,
  name: 'cwns3r8',
  cookie: {
    secure: false, // if true: only transmit cookie over https, in prod, always activate this
    httpOnly: true, // if true: prevents client side JS from reading the cookie
    maxAge: 1000 * 60 * 30,
    sameSite: 'lax',
  },
  }))
  
Routers(app);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;