/**
Bootstrap
(sails.config.bootstrap)

An asynchronous bootstrap function that runs before your Sails app gets lifted.
This gives you an opportunity to set up your data model, run jobs, or perform some special logic.

For more information on bootstrapping your app, check out:
http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */




let sailsMailer = require('sails-service-mailer');
let init = require('./init');


module.exports.bootstrap = async (cb) => {
  try {

    // inject moment for jade views
    sails.moment = require('moment');
    sails.moment.locale("zh-TW");

    // Development environment
    /*
    if (sails.config.environment === 'development') {
        var app = sails.express.app;
        app.set('view options', { pretty: true });
        app.locals.pretty = true;
    }
    */

    sails.config.mail.mailer = sailsMailer.create(sails.config.mail.type, sails.config.mail.config);
    sails.services.passport.loadStrategies();

    let models = require('../api/db');
    global.db = models;

    let createInitData = true;
    if(sails.config.createInitData !== undefined) createInitData = sails.config.createInitData;

    if (sails.config.environment === 'development' || sails.config.environment === 'test') {
      await init.database();
      if(createInitData) await init.testData();
    }

    await init.basicData();

    cb();

  } catch (e) {
    cb(e);
  }

};
