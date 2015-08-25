module.exports = {

  database: async () => {
    let force = sails.config.db.force;
    await db.sequelize.sync({force});
  },
  basicData: async () => {
    var roleAdmin = {
      authority: 'admin',
      comment: 'site admin'
    };
    var createRoleAdmin = await db.Role.create(roleAdmin);

    let admin = {
      username: "admin",
      email: "admin@gmail.com",
      mobile: "",
      address: "",
      comment: "",
      RoleId: createRoleAdmin.id
    };
    let userOptions = {where: {username: "admin"}, defaults: admin}
    let createdAdmin = (await db.User.findOrCreate(userOptions))[0];

    let passport = {
      protocol: 'local',
      password: "admin",
      UserId: createdAdmin.id
    };

    let passportOptions = {where: {UserId: createdAdmin.id}, defaults: passport}

    await db.Passport.findOrCreate(passportOptions);

  }  ,
  testData: async () => {

    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    var createRoleUser = await db.Role.create(roleUser);




    var newBuyer = {
      username: "buyer",
      email: "buyer@gmail.com",
      password: "buyer",
      RoleId: createRoleUser.id,
      comment: "this is a newBuyer"
    };
    var createNewBuyer = await db.User.create(newBuyer);

    var newBuyer2 = {
      username: "buyer2",
      email: "buyer2@gmail.com",
      password: "buyer2",
      RoleId: createRoleUser.id,
      comment: "this is newBuyer2"
    };
    var createNewBuyer2 = await db.User.create(newBuyer2);

    var fruitProducts = [{
      name: '圓滿柚',
      description: '每箱六台斤 甜度 ★★★',
      stockQuantity: 100,
      price: 500
    },{
      name: '團圓柚',
      description: '每箱六台斤 甜度 ★★★★',
      stockQuantity: 100,
      price: 625
    },{
      name: '平安柚',
      description: '每箱六台斤 甜度 ★★★★',
      stockQuantity: 100,
      price: 750
    },{
      name: '【特級】團圓柚',
      description: '每箱六台斤 甜度 ★★★★★',
      stockQuantity: 100,
      price: 950
    },{
      name: '【特級】平安柚',
      description: '每箱六台斤 甜度 ★★★★★',
      stockQuantity: 100,
      price: 1200
    }];
    await db.Product.bulkCreate(fruitProducts);

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
      SerialNumber: '0000000',
      paymentTotalAmount: 1234.567,
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





  }
}
