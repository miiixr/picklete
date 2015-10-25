import trunk from './trunk'
import exma from './exma'
import defaults from './defaults'
import fs from 'fs-extra';

let production;
try {
  production = require('./production');
} catch (e) {
}

module.exports = {

  databaseDropAndCreate: async () => {
    if(sails.config.db.dialect == 'mysql'){
      await db.sequelize.query(
        `DROP DATABASE IF EXISTS ${sails.config.db.database};`);
      await db.sequelize.query(
        `CREATE DATABASE IF NOT EXISTS ${sails.config.db.database} CHARACTER SET utf8 COLLATE utf8_unicode_ci;`);
      await db.sequelize.query(`USE ${sails.config.db.database};`);
    }
    else if (sails.config.db.dialect == 'sqlite'){
      await fs.removeSync(sails.config.db.storage);
    }
  },

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
      email: "buyer@gmail.com",
      password: "buyer",
      RoleId: createRoleUser.id,
      comment: "this is a newBuyer",
      orderSyncToken:'11111',
      mobile: '0937397377',
      verification: true
    };
    var createNewBuyer = await db.User.create(newBuyer);

    let passport = {
      protocol: 'local',
      password: "buyer",
      UserId: createNewBuyer.id
    };

    await db.Passport.create(passport);


    let params = {createRoleUser, createNewBuyer}




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
