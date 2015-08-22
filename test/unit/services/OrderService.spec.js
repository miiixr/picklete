import moment from 'moment';
describe.only("about order service", () => {
  it('date to order SerialNumber', async (done) => {

    try {
      let date = moment("2015-08-31", "YYYY-MM-DD").tz('Asia/Taipei');
      let OrderSerialNumber = await OrderService.generateOrderSerialNumber(date);
      OrderSerialNumber.should.be.equal('158v001');
      done();
    } catch (e) {
      done(e);
    }

  });
});
