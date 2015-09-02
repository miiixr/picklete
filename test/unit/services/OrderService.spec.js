import moment from 'moment';
describe("about order service", () => {
  it('date to order SerialNumber', async (done) => {

    try {
      let date = moment("2015-08-31", "YYYY-MM-DD");
      let orderSerialNumber = await OrderService._dateFormat(date);
      orderSerialNumber.should.be.equal('158v');
      done();
    } catch (e) {
      done(e);
    }

  });
});
