describe("about order service", () => {
  it('date to order SerialNumber', async (done) => {
    let date = new Date();
    let dateString = OrderService._dateFormat(date);

    let OrderSerialNumber = await OrderService.generateOrderSerialNumber();
    OrderSerialNumber.indexOf(dateString).should.be.true;
  });
});
