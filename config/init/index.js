import trunk from './trunk'


module.exports = {

  database: async () => {
    let force = sails.config.db.force;
    await db.sequelize.sync({force});
  },
  basicData: async () => {

    if(sails.config.initData){
      if(sails.config.initData === 'trunk')
        trunk.createTestData();
    }


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
      email: "smlsun@gmail.com",
      password: "buyer",
      RoleId: createRoleUser.id,
      comment: "this is a newBuyer",
      orderSyncToken:'11111'

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

  }
}
