/**
Bootstrap
(sails.config.bootstrap)

An asynchronous bootstrap function that runs before your Sails app gets lifted.
This gives you an opportunity to set up your data model, run jobs, or perform some special logic.

For more information on bootstrapping your app, check out:
http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var models;

models = require('../api/db');

module.exports.bootstrap = async (cb) => {
  sails.services.passport.loadStrategies();
  global.db = models;

  try {
    await models.sequelize.sync({force: true});

    let admin = admin = {
      username: "admin",
      email: "admin@gmail.com",
    };

    let createdAdmin = await db.User.create(admin);

    let passport = {
      protocol: 'local',
      password: "admin",
      UserId: createdAdmin.id

    };
    let createdPassport = await db.Passport.create(passport);

    var newProduct = {
      name: '斗六文旦柚禮盒',
      descript: '3斤裝',
      stockQuantity: 10,
      image: 'http://localhost:1337/images/product/1.jpg'
    };
    var createdProduct = await db.Product.create(newProduct);

    var newBuyer = {
      username: "buyer",
      email: "buyer@gmail.com",
      password: "buyer"
    };
    var createNewBuyer = await db.User.create(newBuyer);

    var newOrder = {
      quantity: 10,
      orderId: '1111',
      UserId: createNewBuyer.id
    };
    var createdOrder = await db.Order.create(newOrder);

    cb();

  } catch (e) {
    cb(e);
  }

};
