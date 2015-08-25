
describe.only("about Mailer service", () => {
  it('send paymentConfirm', async (done) => {

    try {
      let order = {
        serialNumber: 'test',
        User: {
          username: 'testUser',
          email: 'smlsun@gmail.com'
        }

      }

      await CustomMailerService.paymentConfirm(order);
      done();
    } catch (e) {
      done(e);
    }

  });
});
