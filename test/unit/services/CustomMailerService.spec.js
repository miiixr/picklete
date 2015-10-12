
describe("about Mailer service", () => {
  let order = {
    serialNumber: 'test',
    User: {
      username: 'testUser',
      email: 'dan82625@gmail.com'
    }
  }

  let user = {
      fullName: 'testUser',
      email: 'xyz@gmail.com',
      link: 'google.com.tw'
  }

  it('send paymentConfirm', async (done) => {

    try {
      await CustomMailerService.paymentConfirm(order);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send deliveryConfirm', async (done) => {

    try {
      await CustomMailerService.deliveryConfirm(order);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('send verification Mail', async (done) => {

    try {
      let result = await CustomMailerService.verificationMail(user,user.link);
      console.log("!!",result);
      result.to.should.be.equal(user.email);
      result.type.should.be.equal('verification');
      done();
    } catch (e) {
      done(e);
    }

  });

});
