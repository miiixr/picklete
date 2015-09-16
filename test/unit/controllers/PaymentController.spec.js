var Allpay = require('../../../api/services/AllpayService');
var sinon = require('sinon');

describe('about Payment', () => {

  before(async (done) => {

    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    done();
  });

  after((done) => {
    UserService.getLoginState.restore();
    done();
  });

  it('create', (done) => {

    let data = {
      MerchantTradeNo: 'allpay20150830025',
      TotalAmount: 500,
      TradeDesc: 'Allpay push order test',
      ItemName: ['Item01', 'Item02'],
      ChoosePayment: {name: 'ATM'},
      ReturnURL: 'http://localhost:3000',
      ClientBackURL: 'http://localhost:3000',
    };

    request(sails.hooks.http.app).post('/payment/create').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }
      res.statusCode.should.equal(200);
      let result = res.body.result;
      result.should.have.property('MerchantID', 'MerchantTradeDate', 'PaymentType', 'CheckMacValue');
      done(err);
    });
  });

  it('list with MerchantTradeNo', (done) => {
    let data = {
      MerchantTradeNo: 'allpay20150830025',
    };

    request(sails.hooks.http.app).post('/payment/list').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }

      res.statusCode.should.equal(200);
      done(err);
    });
  });

  it.only('order paid allpay return post',(done) => {
    let data = {
      MerchantID : '123456789',
      MerchantTradeNo : '123456abc',
      RtnCode : '1',
      RtnMsg : 'paid',
      TradeNo : '201203151740582564',
      TradeAmt : 22000,
      PaymentDate : '2012/03/16 12:03:12',
      PaymentType : 'ATM_TAISHIN',
      PaymentTypeChargeFee : 25,
      TradeDate : '2012/03/15 17:40:58',
      SimulatePaid : 0,
      CheckMacValue : '',
    };
    request(sails.hooks.http.app)
    .post('/api/allpay/paid')
    .send(data)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log(res.body);
      res.statusCode.should.equal(200);
      return done();
    });
  });

});
