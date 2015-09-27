describe("ShippingService", () => {

  // before testing starts
  before(async (done) => {
    // clean up model
    let findAll = await db.Shipping.findAll();
    let deleteAll = await* findAll.map((shipping) => {
      return shipping.destroy();
      // console.log('=== now this id is destroied ==>',shipping.id);
    });

    // pre-built data
    let testDatas = [
    {
      type: 'postoffice',
      region: 'Taiwan island',
      fee: '100'
    },{
      type: 'postoffice',
      region: 'Out of Taiwan island',
      fee: '200'
    },{
      type: 'delivery',
      region: 'Taiwan island',
      fee: '150'
    },{
      type: 'delivery',
      region: 'Out of Taiwan island',
      fee: '300'
    }];
    // temporarily replace with service
    // await* testDatas.map((testData) => {
    //   db.Shipping.create(testData);
    // });
    let saved = await ShippingService.saveAll(testDatas);

    done();
  });
  // end before

  // after testing
  after((done) => {
    done();
  });
  // end after

  // list all
  it('get all Shippings', async (done) => {
    try {
      // we prebuilt 4 datas before testing.
      let findAll = await ShippingService.findAll();

      console.log('=== findAll.shippings ==>\n',findAll.shippings);

      findAll.success.should.be.true;
      // part 1 - length check
      findAll.shippings.length.should.be.equal(4);
      // part 2 - first one's data
      findAll.shippings[0].type.should.be.equal("postoffice");
      findAll.shippings[0].type.should.be.equal("postoffice");
      findAll.shippings[0].region.should.be.equal("Taiwan island");
      findAll.shippings[0].fee.should.be.equal(100);
      // part 3 - last one's data
      findAll.shippings[3].type.should.be.equal("delivery");
      findAll.shippings[3].region.should.be.equal("Out of Taiwan island");
      findAll.shippings[3].fee.should.be.equal(300);

      done();
    } catch (e) {
      done(e);
    }
  });
  // end list all

  // save all
  it('save SelectionActive', async (done) => {
    // delete all datas before save them all.
    try {
      // this should get a length which should = 4
      let findAllFirst = await ShippingService.findAll();

      // save 5 datas
      let testDatas = [
      {
        type: 'postoffice',
        region: 'Taiwan island',
        fee: 100
      },{
        type: 'postoffice',
        region: 'Out of Taiwan island',
        fee: 200
      },{
        type: 'delivery',
        region: 'Taiwan island',
        fee: 150
      },{
        type: 'delivery',
        region: 'Out of Taiwan island',
        fee: 300
      },{
        type: 'delivery',
        region: 'within 24H Taiwan',
        fee: 500
      }];
      let saved = await ShippingService.saveAll(testDatas);

      // this should get a length which should = 5
      let findAllAgain = await ShippingService.findAll();

      // console.log('=== 4 findAllAgain ==>\n',findAllAgain);
      // console.log('=== 5 saved ==>\n',saved);

      saved.success.should.be.true;
      // part 1 - length check
      findAllFirst.shippings.length.should.be.equal(4);
      // below temporarily commented for weird await issue by Kuyen.
      findAllAgain.shippings.length.should.be.equal(5);
      // part 2 - first one's data
      findAllAgain.shippings[0].type.should.be.equal("postoffice");
      findAllAgain.shippings[0].region.should.be.equal("Taiwan island");
      findAllAgain.shippings[0].fee.should.be.equal(100);
      // part 3 - last one's data
      findAllAgain.shippings[4].type.should.be.equal("delivery");
      findAllAgain.shippings[4].region.should.be.equal("within 24H Taiwan");
      findAllAgain.shippings[4].fee.should.be.equal(500);
      // above temporarily commented for weird await issue by Kuyen.

      done();
    } catch (e) {
      done(e);
    }
  });
});
