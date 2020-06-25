import express from 'express';
import nodemailer from 'nodemailer';
import routes from './routes';

import mailConfig from './config/mail';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  mail() {
    this.mail = nodemailer.createTransport(mailConfig);
  }
}

export default new App().server;
