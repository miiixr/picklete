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

    var group1 = {
      name: 'admin',
      comment: 'site admin'
    };
    var createGroup1 = await db.UserGroup.create(group1);

    var group2 = {
      name: 'vip',
      comment: 'super buyer'
    };
    var createGroup2 = await db.UserGroup.create(group2);

    var group3 = {
      name: "banned",
      comment: "banned buyer"
    };
    var createGroup3 = await db.UserGroup.create(group3);

    let admin = admin = {
      username: "admin",
      email: "admin@gmail.com",
      mobile: "0123456789",
      address: "address",
      comment: "this is site admin",
      UserGroupId: createGroup1.id
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
      password: "buyer",
      UserGroupId: createGroup2.id,
      comment: "this is a newBuyer"
    };
    var createNewBuyer = await db.User.create(newBuyer);

    var newBuyer2 = {
      username: "buyer2",
      email: "buyer2@gmail.com",
      password: "buyer2",
      UserGroupId: createGroup3.id,
      comment: "this is newBuyer2"
    };
    var createNewBuyer2 = await db.User.create(newBuyer2);

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

    // var groups = {
    //   g1 :{
    //     name: 'g1',
    //     comment: 'g1'
    //   },
    //   g2 :{
    //     name: 'g2',
    //     comment: 'g2'
    //   },
    // };
    // for (var g in groups){
    //   var createGroups = await db.UserGroup.create(g);
    // };

    cb();

  } catch (e) {
    cb(e);
  }

};
