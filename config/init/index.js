import trunk from './trunk'


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

    if(sails.config.initData){
      if(sails.config.initData === 'trunk')
        await trunk.createTestData();
    }

    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    var createRoleUser = await db.Role.create(roleUser);


    var newBuyer = {
      username: "buyer",
      email: "smlsun@gmail.com",
      password: "buyer",
      RoleId: createRoleUser.id,
      comment: "this is a newBuyer",
      orderSyncToken:'11111',
      mobile: '0937397377'
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
      name: '好物三選1',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 500
    },{
      name: '好物三選2',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 625
    },{
      name: '好物三選3',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 750
    }];
    await db.Product.bulkCreate(fruitProducts);

    var newProduct = {
      name: '超值精選組合',
      description: '精選組合 - 重金包裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: '限量只有 10 個'
    };
    var createdProduct = await db.Product.create(newProduct);

    var newOrder = {
      serialNumber: '0000000',
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


    var newOrder2 = {
      serialNumber: '0000001',
      paymentIsConfirmed: true,
      paymentTotalAmount: 1000,
      paymentConfirmDate: Date.now(),
      paymentConfirmName: '王小明',
      paymentConfirmPostfix: '54321',
      quantity: 5,
      orderId: '1111',
      UserId: createNewBuyer.id,
      ProductId: createdProduct.id
    };
    var createdOrder = await db.Order.create(newOrder2);


    var brandExample = {
      name: '好棒棒品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'PRIME_GOOD',
      desc: 'Steve Aoki 最棒惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    };

    var brand = await db.Brand.create(brandExample);


    var brandAgent = {
      name: '好代理品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'AGENT',
      desc: 'Steve Aoki 最喜歡代理惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    };

    var otherAgent = {
      name: 'Other',
      avatar: '',
      type: 'OTHER',
      desc: '',
      banner: '',
      photos: []
    };

    var brandAgent = await db.Brand.create(brandAgent);

    var otherAgent = await db.Brand.create(otherAgent);

    let dpts = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let i in dpts) {
      var dpt = await (db.Dpt.create({
        name: '館別' + dpts[i],
        weight: i,
        official: true,
      }));

      for (var j=1; j<4; j++) {
        await db.DptSub.create({
          name: '小館-' +  dpts[i] + '-' + j,
          weight: j,
          official: false,
          DptId: dpt.id
        })
      }
    }
    // end create dpt

    // create tag
    let tags = ['男人', '女人', '兒童', '情人', '學生', '寵物', '旅行', '閱讀', '咖啡', '午茶', '派對', '時尚', '印花', '夏日', '冬季', '聖誕', '森林', '動物', '花園', '浪漫', '可愛', '趣味', '復古', '環保', '工業', '簡約'];
    for (let i in tags) {
      await db.Tag.create({
        name: tags[i]
      });
    }
    // end of create tag

    let isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await db.sequelize.transaction({isolationLevel});

    // Greeting Message to New Buyer
    var mail = CustomMailerService.greeting(newBuyer);
    let msg = await db.Message.create(mail, {transaction});
    transaction.commit();
    CustomMailerService.sendMail(msg);

    transaction = await db.sequelize.transaction({isolationLevel});

    var sms = SimpleMessageService.greeting(newBuyer);
    msg = await db.Message.create(sms, {transaction});
    transaction.commit();
    SimpleMessageService.send(msg);

  }
}
