import trunk from './trunk'
import exma from './exma'
let production;
try {
  production = require('./production');
} catch (e) {
}

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

    if(sails.config.initData === 'production' && production !== undefined)
      await production.createBasicData();

  },
  testData: async () => {

    if(sails.config.initData){
      if(sails.config.initData === 'trunk')
        await trunk.createTestData();
      if(sails.config.initData === 'exma')
        await exma.createTestData();
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


    let newProductGm = [{
      brandId: 1,
      dptId: ["1"],
      dptSubId: ["1"],
      explain: 'lalalalal',
      usage: 'noanoa',
      notice: 'doludolu',
      tag: [
        "aa",
        "情人"
      ],
      coverPhoto: []
    },{
      brandId: 2,
      dptId: ["2"],
      dptSubId: ["2"],
      explain: 'explainexplain',
      usage: 'usageusage',
      notice: 'noticenotice',
      tag: [
            "咖啡",
            "午茶",
            "旅行"
      ],
      coverPhoto: []
    }];
    // create product gm
    let createdProductGm = await db.ProductGm.bulkCreate(newProductGm);


    var fruitProducts = [{
      name: '好物三選1',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 500,
      ProductGmId: 1,
      size: 'super-big',
      service: ["express","store","package"],
      country: 'Taiwan',
      madeby: 'Peter Chou',
      color: 5,
      productNumber: '1-DDT-2-G',
      spec: '鋁'
    },{
      name: '好物三選2',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 625,
      ProductGmId: 2,
      size: 'super-small',
      service: ["package"],
      country: 'U.S.A',
      madeby: 'Tony Stack',
      color: 4,
      productNumber: '2-DDE-2-G',
      spec: '汎合金'
    },{
      name: '好物三選3',
      description: '好東西，買買買',
      stockQuantity: 100,
      price: 750,
      ProductGmId: 2,
      size: 'super-big',
      service: ["store"],
      country: 'Japan',
      madeby: 'doraemon',
      color: 2,
      productNumber: '1-ABC-2-G',
      spec: '塑膠'
    }];
    let createdProducts =  await db.Product.bulkCreate(fruitProducts);

    var newProduct = {
      name: '超值精選組合',
      description: '精選組合 - 重金包裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: '限量只有 10 個',
      ProductGmId: 2,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'unknow',
      color: 3,
      productNumber: '1-GOLD-2-G',
      spec: 'super-metal'
    };
    var createdProduct = await db.Product.create(newProduct);

    var newOrder = {
      serialNumber: '0000000',
      paymentTotalAmount: 1234.567,
      quantity: 10,
      orderId: '1111',
      UserId: createNewBuyer.id,
      ProductId: createdProduct.id,
      size: '正常尺寸',
      service: ["express"],
      country: '克里普頓星',
      madeby: '超人套裝批發製作 Corp.',
      color: 2,
      productNumber: '1-alien-9-Z',
      description: '凱·艾爾的超級披風（紅）',
      spec: '克利普頓絲'
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

    var orderItems ={
      name: '好物三選1',
      description: '好東西，買買買',
      quantity: 4,
      price: 500,
      OrderId: createdOrder.id,
      ProductId: createdProduct.id
    }
    var createOrderItems = await db.OrderItem.create(orderItems);

    var brandExample = [{
      name: '好棒棒品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'PRIME_GOOD',
      desc: 'Steve Aoki 最棒惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    },{
      name: 'Sydney-精選',
      avatar: 'https://goo.gl/XbP9t3',
      type: 'PRIME_GOOD',
      desc: '',
      banner: 'http://goo.gl/tl4513',
      photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
      ]
    }];

    var brand = await db.Brand.bulkCreate(brandExample);


    var brandAgent = [{
      name: '好代理品牌',
      avatar: 'http://goo.gl/ksTMyn',
      type: 'AGENT',
      desc: 'Steve Aoki 最喜歡代理惹',
      banner: 'http://goo.gl/tl4513',
      photos: [
        'http://goo.gl/IRT1EM',
        'http://goo.gl/p9Y2BF'
      ]
    },{
      name: 'Sydney-代理',
      avatar: 'https://goo.gl/XbP9t3',
      type: 'AGENT',
      desc: '',
      banner: 'http://goo.gl/tl4513',
      photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
      ]
    }];

    var otherAgent = {
      name: 'Other',
      avatar: '',
      type: 'OTHER',
      desc: '',
      banner: '',
      photos: []
    };

    var brandAgent = await db.Brand.bulkCreate(brandAgent);

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

    let specialDpt = await db.Dpt.create({
      name: '特別企劃',
      weight: 999,
      official: true,
    });

    var specialSubDpt = ["閃購專區", "優惠商品", "本月主題"];
    for (let i in specialSubDpt) {
      await (db.DptSub.create({
        name: specialSubDpt[i],
        weight: 999,
        official: true,
        DptId: specialDpt.id
      }));
    }

    let createdProductGmComplete;
    let productGmA, productGmB, dptA, dptB, dptSubA, dptSubB;


    dptA = await db.Dpt.create({
      name: 'test 大館 A',
      weight: 999,
      official: true,
    });

    dptB = await db.Dpt.create({
      name: 'test 大館 B',
      weight: 999,
      official: true,
    });

    dptSubA = await db.DptSub.create({
      name: 'test 小館 A',
      weight: 100,
      official: false
    })

    dptSubB = await db.DptSub.create({
      name: 'test 小館 B',
      weight: 100,
      official: false
    })

    await dptA.setDptSubs(dptSubA);
    await dptB.setDptSubs(dptSubB);

    createdProductGmComplete = await db.ProductGm.create({
      brandId: 1,
      explain: 'req.body.explain',
      usage: 'req.body.usage',
      notice: 'req.body.notice',
      depId: dptA.id,
      depSubId: dptSubA.id
    });

    await createdProductGmComplete.setDpts([dptA]);
    await createdProductGmComplete.setDptSubs([dptSubA]);


    createdProduct = await db.Product.create({
      description: '11',
      name: '111',
      stockQuantity: '100',
      isPublish: 'false',
      price: 0,
      ProductGmId: createdProductGmComplete.id,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'unknow',
      color: 3,
      productNumber: '1-USA-2-G',
      spec: 'super-metal'
    });

    // create tag
    let tags = ["男人", "女人", "兒童", "情人", "學生", "寵物", "旅行", "閱讀", "咖啡", "午茶", "派對", "時尚", "印花", "夏日", "冬季", "聖誕", "森林", "動物", "花園", "浪漫", "可愛", "趣味", "復古", "環保", "工業", "簡約"];
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



    // mock a lot of fake users
    var commonLastNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '郭', '洪', '邱', '曾', '廖', '賴', '徐', '周', '葉', '蘇', '莊', '江', '呂', '何', '羅', '高', '蕭', '潘', '朱', '簡', '鍾', '彭', '游', '詹', '胡', '施', '沈', '余', '趙', '盧', '梁', '顏', '柯', '孫', '魏', '翁', '戴', '范', '宋', '方', '鄧', '杜', '傅', '侯', '曹', '溫', '薛', '丁', '馬', '蔣', '唐', '卓', '藍', '馮', '姚', '石', '董', '紀', '歐', '程', '連', '古', '汪', '湯', '姜', '田', '康', '鄒', '白', '塗', '尤', '巫', '韓', '龔', '嚴', '袁', '鐘', '黎', '金', '阮', '陸', '倪', '夏', '童', '邵', '柳', '錢'];

    var commonFirstNames = ['冠廷', '冠宇', '宗翰', '家豪', '彥廷', '承翰', '柏翰', '宇軒', '家瑋', '冠霖', '雅婷', '雅筑', '怡君', '佳穎', '怡萱', '宜庭', '郁婷', '怡婷', '詩涵', '鈺婷'];

    var randomInt = function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    };

    var randomDate = function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    for (var i=0; i<100; i++) {
      var fakeUser = {
        username: "user" + i,
        fullName: commonLastNames[randomInt(0, commonLastNames.length)] + commonFirstNames[randomInt(0, commonFirstNames.length)],
        birthDate: randomDate(new Date(1930, 0, 1), new Date(2005, 0, 1)),
        email: "user" + i + "@picklete.localhost",
        password: "0000",
        RoleId: createRoleUser.id,
        comment: "i'm a fake user",
        orderSyncToken: '',
        mobile: '0900'+randomInt(100000, 999999)
      };
      var createFakeUser = await db.User.create(fakeUser);

      var newOrder2 = {
        serialNumber: '00000'+i+1,
        paymentIsConfirmed: true,
        paymentTotalAmount: 1000,
        paymentConfirmDate: randomDate(new Date(2015, 9, 8), new Date(2015, 9, 20)),
        paymentConfirmName:  createFakeUser.fullName,
        paymentConfirmPostfix: '54321',
        quantity: randomInt(0,20),
        orderId: randomInt(1000, 9999),
        UserId: createFakeUser.id,
        ProductId: createdProduct.id
      };
      var createdOrder = await db.Order.create(newOrder2);

      var shipment2 = {
        username: createFakeUser.fullName,
        mobile: createFakeUser.mobile,
        taxId: '123456789',
        email: createFakeUser.email,
        address: '收件者的家',
        OrderId: createdOrder.id
      }
      var createShipment = await db.Shipment.create(shipment2);


      var orderItems2 =[{
        name: '好物三選1',
        description: '好東西，買買買',
        quantity: 1,
        price: 500,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      },{
        name: '好物三選2',
        description: '好東西，買買買',
        quantity: 2,
        price: 100,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      },{
        name: '好物三選3',
        description: '好東西，買買買',
        quantity: 3,
        price: 200,
        OrderId: createdOrder.id,
        ProductId: createdProduct.id
      }]
      var createOrderItems = await db.OrderItem.bulkCreate(orderItems2);
 
    }

  }
}
