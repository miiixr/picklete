
describe("about Mailer service", () => {
  let order = {
    serialNumber: 'test',
    User: {
      username: 'testUser',
      email: 'smlsun@gmail.com'
    }
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
      let result = await CustomMailerService.verificationMail(order);
      result.to.should.be.equal(order.email);
      result.type.should.be.equal('verification');
      done();
    } catch (e) {
      done(e);
    }

  });

});
