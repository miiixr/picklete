
// simulate login
var sinon = require('sinon');

describe("about Shipping", () => {

  // before testing
  before(async (done) => {

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
    await* testDatas.map(async (testData) => {
      return await db.Shipping.create(testData);
    });

    // simulate login
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    done();
  });
  // end before

  // after testing
  after((done) => {

    // simulated loginout
    UserService.getLoginState.restore();

    done();
  });
  // end after

  // get Shipping list
  it('show Shipping list', (done) => {
    request(sails.hooks.http.app)
    .get(`/admin/shipping?responseType=json`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body. ===>\n',res.body);
      res.statusCode.should.equal(200);
      res.body.shippings.should.be.Object;
      res.body.shippings.forEach(shipping => {
        shipping.type.should.be.String;
        shipping.region.should.be.String;
        shipping.fee.should.be.number;
      });
      done(err);
    });
  });
  // end get update view

  // post Shipping list
  it('save shipping list', (done) => {
    request(sails.hooks.http.app)
    .post(`/admin/shipping?responseType=json`)
    .send([
    {
      type: 'postoffice',
      region: 'Taiwan',
      fee: 666
    },{
      type: 'delivery',
      region: 'Japan',
      fee: 888
    }])
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body. ===>\n',res.body);
      // check status
      res.statusCode.should.equal(200);
      // check types
      res.body.should.be.Object;
      res.body.savedShippings.length.should.be.equal(2);
      // below temporarily commented for weird await issue at ShippingService by Kuyen.
      res.body.savedShippings.forEach(shipping => {
        shipping.type.should.be.String;
        shipping.region.should.be.String;
        shipping.fee.should.be.number;
      });
      // check values
      res.body.savedShippings[0].fee.should.be.equal(666);
      res.body.savedShippings[0].type.should.be.equal('postoffice');
      res.body.savedShippings[0].region.should.be.equal('Taiwan');
      res.body.savedShippings[1].fee.should.be.equal(888);
      res.body.savedShippings[1].type.should.be.equal('delivery');
      res.body.savedShippings[1].region.should.be.equal('Japan');
      // above temporarily commented for weird await issue at ShippingService by Kuyen.

      done(err);
    });
  });
  // end get update view

});
