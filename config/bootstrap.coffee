###*
Bootstrap
(sails.config.bootstrap)

An asynchronous bootstrap function that runs before your Sails app gets lifted.
This gives you an opportunity to set up your data model, run jobs, or perform some special logic.

For more information on bootstrapping your app, check out:
http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
###
models  = require('../api/db');
module.exports.bootstrap = (cb) ->
  sails.services.passport.loadStrategies();

  global.db = models

  models.sequelize.sync({force: true}).then () ->

    # It's very important to trigger this callback method when you are finished
    # with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    adminTestDataCreate = (done) ->

      admin = {
        username  : "admin"
        email     : "admin@gmail.com"
      }

      db.User.create(admin).then (createdAdmin)->
        passport = {
          protocol: 'local'
          password: "admin"
        }

        db.Passport.create(passport).then (createdPassport) ->

          createdAdmin.setPassports(createdPassport).then () ->
            done(null)

    productTestDataCreate = (done) ->
      newProduct = {
        name: '斗六文旦柚禮盒'
        descript: '3斤裝'
        stockQuantity: 10
        image: 'http://localhost:1337/images/product/1.jpg'
      }

      db.Product.create(newProduct).then (createdProduct) ->
        done(null)

    orderTestDataCreate = (done) ->
      newBuyer = {
        username: "buyer"
        email: "buyer@gmail.com"
        password: "buyer"
      }
      db.User.create(newBuyer).then (newBuyer) ->
        newOrder = {
          quantity: 10
          orderId: '1111'
          UserId: newBuyer.id
        }
        db.Order.create(newOrder).then (createdOrder) ->
          done()


    async.series [
      adminTestDataCreate
      productTestDataCreate
      orderTestDataCreate
    ], (err, results) ->
      return cb()

  return
