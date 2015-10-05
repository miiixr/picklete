import sinon from 'sinon';

describe("about shopcode service", () => {

  let testShopCode,testTimeOutShopCode;

  before(async (done) => {
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    var shopcode = {
        title: '測試',
        code: '12345678901234567890',
        autoRandomCode: 'on',
        startDate: '2015-10-01',
        endDate: '2015-10-14',
        type: 'price',
        description: 99,
        restriction: 999,
        sentType: 'all',
        sentContent: '測試'
      };
    testShopCode = await db.ShopCode.create(shopcode);

    var shopcode2 = {
        title: '測試',
        code: 'AAAAAAAAAABBBBBBBBBB',
        autoRandomCode: 'on',
        startDate: '2015-9-01',
        endDate: '2015-9-30',
        type: 'price',
        description: 99,
        restriction: 999,
        sentType: 'all',
        sentContent: '測試'
      };
    testTimeOutShopCode = await db.ShopCode.create(shopcode2);

    done();
  });

  after((done) => {
    // end this simulated login
    UserService.getLoginState.restore();
    done();
  });

  it('check', async (done) => {
    try {
      let check = await ShopCodeService.checkCode(testShopCode.code);
      check.result.id.should.be.equal(testShopCode.id);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('use ShopCode', async (done) => {
    try {
      var data ={
        code: testShopCode.code,
        price: 999,
      }
      let check = await ShopCodeService.use(testShopCode.code);
      check.result.price.should.be.equal(900);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('use ShopCode but money not enough', async (done) => {
    try {
      var data ={
        code: testShopCode.code,
        price: 899,
      }
      let check = await ShopCodeService.use(testShopCode.code);
      done();
    } catch (e) {
      e.message.should.be.equal('金額不足');
      done(e);
    }
  });

  it('use ShopCode but time out', async (done) => {
    try {
      var data ={
        code: testShopCode.code,
        price: 999,
      }
      let check = await ShopCodeService.use(testTimeOutShopCode.code);
      done();
    } catch (e) {
      e.message.should.be.equal('超出活動時間');
      done(e);
    }
  });
});
