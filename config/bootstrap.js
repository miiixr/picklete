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
  sails.config.mail.mailer = sailsMailer.create(sails.config.mail.type, sails.config.mail.config);
  sails.services.passport.loadStrategies();

  let models = require('../api/db');
  global.db = models;

  try {
    let force = sails.config.db.force;
    await models.sequelize.sync({force});
    if (sails.config.environment === 'development') await init.data();

    cb();

  } catch (e) {
    cb(e);
  }

};
