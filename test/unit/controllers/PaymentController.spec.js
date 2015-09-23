var Allpay = require('../../../api/services/AllpayService');
var sinon = require('sinon');

describe('about Payment', () => {
  let testdOrder;
  before(async (done) => {

    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    var fakeUser = {
      username: 'allpay測試帳號',
      fullName:'allpay測試帳號',
      birthDate: new Date(1983, 1, 1),
      email: "user" + 1000 + "@picklete.local",
      password: "0000",
      RoleId: 1,
      comment: "i'm a fake user",
      orderSyncToken: '',
      mobile: '0900000000'
    };
    var createFakeUser = await db.User.create(fakeUser);

    var newOrder2 = {
      serialNumber: '99999',
      paymentIsConfirmed: false,
      paymentTotalAmount: 1000,
      paymentConfirmName:  '測試',
      paymentConfirmPostfix: '54321',
      quantity: 2,
      UserId: 2,
    };
    testdOrder = await db.Order.create(newOrder2);

    var orderItems2 =[{
      name: '好物三選1',
      description: '好東西，買買買',
      quantity: 1,
      price: 500,
      OrderId: testdOrder.id,
      ProductId: 1
    },{
      name: '好物三選2',
      description: '好東西，買買買',
      quantity: 2,
      price: 100,
      OrderId: testdOrder.id,
      ProductId: 1
    },{
      name: '好物三選3',
      description: '好東西，買買買',
      quantity: 3,
      price: 200,
      OrderId: testdOrder.id,
      ProductId: 1
    }];
    let createOrderItems = await db.OrderItem.bulkCreate(orderItems2);

    var shipment2 = {
      username: createFakeUser.fullName,
      mobile: createFakeUser.mobile,
      taxId: '123456789',
      email: createFakeUser.email,
      address: '收件者的家',
      OrderId: testdOrder.id
    }
    var createShipment = await db.Shipment.create(shipment2);

    done();
  });

  after((done) => {
    UserService.getLoginState.restore();
    done();
  });

  it.skip('create', (done) => {

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
      if (err)
        return done(err);
      if (res.statusCode === 500) {
        return done(err);
      }
      res.statusCode.should.equal(200);
      let result = res.body.result;
      result.should.have.property('MerchantID', 'MerchantTradeDate', 'PaymentType', 'CheckMacValue');
      done();
    });
  });

  it.skip('list with MerchantTradeNo', (done) => {
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

  it('order paid allpay return post',(done) => {
    let data = {
      MerchantID : '123456789',
      MerchantTradeNo : sails.config.allpay.merchantID + testdOrder.id,
      RtnCode : '1',
      RtnMsg : 'paid',
      TradeNo : '201203151740582564',
      TradeAmt : 22000,
      PaymentDate : '2012/03/16 12:03:12',
      PaymentType : 'ATM_TAISHIN',
      PaymentTypeChargeFee : 25,
      TradeDate : '2012/03/15 17:40:58',
      SimulatePaid : 0,
      CheckMacValue : '989ED3A9503EEF31CF07C387F7E2AD5C',
    };
    request(sails.hooks.http.app)
    .post('/allpay/paid')
    .send(data)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log(res.text);
      res.statusCode.should.equal(200);
      return done();
    });
  });

  it('allpay PaymentInfoURL return post by ATM',(done) => {
    let data = {
      MerchantID : '123456789',
      MerchantTradeNo : sails.config.allpay.merchantID + testdOrder.id,
      RtnCode : '2',
      RtnMsg : 'Get VirtualAccount Succeeded',
      TradeNo : '201203151740582564',
      TradeAmt : 22000,
      PaymentType : 'ATM_TAISHIN',
      TradeDate : '2012/03/15 17:40:58',
      CheckMacValue : '989ED3A9503EEF31CF07C387F7E2AD5C',
      BankCode: '812',
      vAccount: '9103522175887271',
      ExpireDate: '2013/12/16'
    };
    request(sails.hooks.http.app)
    .post('/allpay/paymentinfo')
    .send(data)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log(res.text);
      res.statusCode.should.equal(200);
      return done();
    });
  });

  it('allpay PaymentInfoURL return post by CVS or BARCODE',(done) => {
    let data = {
      MerchantID : '123456789',
      MerchantTradeNo : sails.config.allpay.merchantID + testdOrder.id,
      RtnCode : '2',
      RtnMsg : 'Get VirtualAccount Succeeded',
      TradeNo : '201203151740582564',
      TradeAmt : 22000,
      PaymentType : 'ATM_TAISHIN',
      TradeDate : '2012/03/15 17:40:58',
      CheckMacValue : '989ED3A9503EEF31CF07C387F7E2AD5C',
      PaymentNo: 'GW130412257496',
      ExpireDate: '2013/12/16 18:00:00',
      Barcode1: '021030627',
      Barcode2: '2470200001841540',
      Barcode3: '103027000000100'
    };
    request(sails.hooks.http.app)
    .post('/allpay/paymentinfo')
    .send(data)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log(res.text);
      res.statusCode.should.equal(200);
      return done();
    });
  });

});
