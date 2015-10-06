import trunk from './trunk'
import exma from './exma'
import defaults from './defaults'
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
    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    let roleUserOptions = {where: {authority: 'user'}, defaults: roleUser}
    var createRoleUser = (await db.Role.findOrCreate(roleUserOptions))[0];

    var roleAdmin = {
      authority: 'admin',
      comment: 'site admin'
    };
    let roleAdminOptions = {where: {authority: 'admin'}, defaults: roleAdmin}
    var createRoleAdmin = (await db.Role.findOrCreate(roleAdminOptions))[0];

    let admin = {
      username: "admin",
      email: "admin@gmail.com",
      mobile: "0900000000",
      address: "admin",
      comment: "",
      city: "基隆市",
      region: "仁愛區",
      zipcode: 200,
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

    await createdAdmin.setLikes([1, 2, 3, 4, 5]);

    if(sails.config.initData === 'production' && production !== undefined)
      await production.createBasicData();

  },

  // testDate
  testData: async () => {

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

    let params = {createRoleUser, createNewBuyer}


    let like = [
      {title: '我是文具控'},
      {title: '沒有咖啡醒不來'},
      {title: '流浪的迷途，是旅行的終點 喝午茶、聊是非'},
      {title: '給孩子最好的一切'},
      {title: '絕不錯過最新的科技產品！ 妝點居家生活'},
      {title: '音樂是我的靈魂'},
      {title: '享受美學是我的生活態度 寵物就是兒女'},
      {title: '皮革的溫度無法取代'},
      {title: '我總是不小心造成流行 空氣中香味瀰漫'},
      {title: '我運動所以我存在'},
      {title: '呼朋引伴、派對 all night 上班偷逛網購...！'},
      {title: '微醺是種享受、宿醉好想請假'}
    ];

    await db.Like.bulkCreate(like);


    if(sails.config.initData){
      if(sails.config.initData === 'trunk')
        await trunk.createTestData();
      else if(sails.config.initData === 'exma')
        await exma.createTestData();
      else
        await defaults.createTestData(params);
    }
    else
      await defaults.createTestData(params);
  }
  // end testData
}
