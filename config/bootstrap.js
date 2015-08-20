/**
Bootstrap
(sails.config.bootstrap)

An asynchronous bootstrap function that runs before your Sails app gets lifted.
This gives you an opportunity to set up your data model, run jobs, or perform some special logic.

For more information on bootstrapping your app, check out:
http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */


let models = require('../api/db');

let sailsMailer = require('sails-service-mailer');



module.exports.bootstrap = async (cb) => {

  sails.config.mail.mailer = sailsMailer.create(sails.config.mail.type, sails.config.mail.config);

  sails.services.passport.loadStrategies();
  global.db = models;

  try {
    await models.sequelize.sync({force: true});

    var fruitProducts = [{
      name: '圓滿柚',
      description: '每箱六台斤 甜度 ★★★',
      price: 500
    },{
      name: '團圓柚',
      description: '每箱六台斤 甜度 ★★★★',
      price: 625
    },{
      name: '平安柚',
      description: '每箱六台斤 甜度 ★★★★',
      price: 750
    },{
      name: '【特級】團圓柚',
      description: '每箱六台斤 甜度 ★★★★★',
      price: 950
    },{
      name: '【特級】平安柚',
      description: '每箱六台斤 甜度 ★★★★★',
      price: 1200
    }];
    await db.Product.bulkCreate(fruitProducts);



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

    var newBuyer = {
      username: "buyer",
      email: "buyer@gmail.com",
      password: "buyer"
    };
    var createNewBuyer = await db.User.create(newBuyer);

    var newProduct = {
      name: '斗六文旦柚禮盒',
      description: '3斤裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
    };
    var createdProduct = await db.Product.create(newProduct);

    var newOrder = {
      quantity: 10,
      orderId: '1111',
      UserId: createNewBuyer.id,
      ProductId: createdProduct.id
    };
    var createdOrder = await db.Order.create(newOrder);

    var shipment = {
      username: '收件者',
      mobile: '0922-222-222',
      taxId: '123456789',
      email: 'receiver@gmail.com',
      address: '收件者的家',
      OrderId: createdOrder.id
    }

    var createShipment = await db.Shipment.create(shipment);




    cb();

  } catch (e) {
    cb(e);
  }

};
