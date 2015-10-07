import sinon from 'sinon';

describe("about forgot password", () => {
  let testUser ,passport;
  before(async (done) => {
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    var roleUser = {
      authority: 'user',
      comment: 'site user'
    };
    let roleUserOptions = {where: {authority: 'user'}, defaults: roleUser}
    var createRoleUser = (await db.Role.findOrCreate(roleUserOptions))[0];

    testUser = {
      username: "testForgot",
      email: "aa@gmail.com",
      mobile: "0900000000",
      address: "admin",
      comment: "",
      city: "基隆市",
      region: "仁愛區",
      zipcode: 200,
      RoleId: createRoleUser.id
    };
    let userOptions = {where: {username: testUser.username}, defaults: testUser}
    let createdTest = (await db.User.findOrCreate(userOptions))[0];

    passport = {
      protocol: 'local',
      password: "test",
      UserId: createdTest.id
    };
    let passportOptions = {where: {UserId: createdTest.id}, defaults: passport}
    await db.Passport.findOrCreate(passportOptions);

    done();
  });

  after((done) => {
    // end this simulated login
    UserService.getLoginState.restore();
    done();
  });

  it('forgot', async (done) => {
    try {
      let result = await AuthService.sendForgotMail(testUser.email);
      result.forgotToken.should.be.String;
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('email Not fount', async (done) => {
    try {
      let result = await AuthService.sendForgotMail('123'+testUser.email);
      done(new Error('should not pass!'));
    } catch (e) {
      console.log(e);
      e.message.should.be.String;
      done();
    }
  });

  it('check Token & change radon password & return ', async (done) => {
    try {
      var data={
        email: testUser.email,
        forgotToken: '12345678901234567890'
      }
      let result = await AuthService.changeForgotPassword(data);
      result.id.should.be.equal(createdTest.id);
      result.password.should.be.not.equal(passport.password);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

});
