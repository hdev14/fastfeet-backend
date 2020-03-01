import nodemailer from 'nodemailer';
import hbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null
    });

    this.configurationTemplates();
  }

  configurationTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'email');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: hbs.create({
          extname: '.hbs',
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default'
        }),
        viewPath,
        extName: '.hbs'
      })
    );
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message
    });
  }
}

export default new Mail();
