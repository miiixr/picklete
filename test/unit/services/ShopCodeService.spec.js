import sinon from 'sinon';
import moment from 'moment';

describe("about shopcode service", () => {

  let testShopCode,testTimeOutShopCode,testTimeNolimitShopCode,testTypeDiscountShopCode;

  before(async (done) => {
    try {
      sinon.stub(UserService, 'getLoginState', (req) => {
        return true;
      });

      var shopcode = {
          title: '測試',
          code: 'YYYYYYYYYYZZZZZZZZZZ',
          autoRandomCode: 'on',
          startDate: '2015-10-01',
          endDate: '2120-10-10',
          type: 'price',
          description: 99,
          restriction: 999,
          sentType: 'all',
          sentContent: '測試'
        };
      testShopCode = await db.ShopCode.create(shopcode);

      var shopcode2 = {
          title: '測試折扣碼逾時',
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

      var shopcode3 = {
          title: '測試不限時的折扣碼',
          code: 'CCCCCCCCCCDDDDDDDDDD',
          autoRandomCode: 'on',
          startDate: '1970-01-01',
          endDate: '1970-01-01',
          type: 'price',
          description: 99,
          restriction: 999,
          sentType: 'all',
          sentContent: '測試',
          restrictionDate: 'on'
        };
      testTimeNolimitShopCode = await db.ShopCode.create(shopcode3);

      var shopcode4 = {
          title: '測試打折的折扣碼',
          code: 'EEEEEEEEEEFFFFFFFFFF',
          autoRandomCode: 'on',
          startDate: '1970-01-01',
          endDate: '1970-01-01',
          type: 'discount',
          description: 80,
          restriction: 999,
          sentType: 'all',
          sentContent: '測試',
          restrictionDate: 'on'
        };
      testTypeDiscountShopCode = await db.ShopCode.create(shopcode4);

      done();


    } catch (e) {
      done(e);

    }
  });

  after((done) => {
    // end this simulated login
    UserService.getLoginState.restore();
    done();
  });

  it('check', async (done) => {
    try {
      let check = await ShopCodeService.checkCode(testShopCode.code);
      check.id.should.be.equal(testShopCode.id);
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
      let check = await ShopCodeService.use(data);
      check.price.should.be.equal(900);
      check.discountAmount.should.be.equal(99);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('use ShopCode time no limit', async (done) => {
    try {
      var data ={
        code: testTimeNolimitShopCode.code,
        price: 999,
      }
      let check = await ShopCodeService.use(data);
      check.price.should.be.equal(900);
      check.discountAmount.should.be.equal(99);
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });

  it('use ShopCode type discount', async (done) => {
    try {
      var data ={
        code: testTypeDiscountShopCode.code,
        price: 1000,
      }
      let check = await ShopCodeService.use(data);
      check.price.should.be.equal(800);
      check.discountAmount.should.be.equal(200);
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
      let check = await ShopCodeService.use(data);
      done(new Error('should not pass!'));
    } catch (e) {
      e.message.should.be.equal('請再次確認折扣碼活動時間、活動金額');
      done();
    }
  });

  it('use ShopCode but time out', async (done) => {
    try {
      var data ={
        code: testTimeOutShopCode.code,
        price: 999,
      }
      let check = await ShopCodeService.use(data);
      done(new Error('should not pass!'));
    } catch (e) {
      e.message.should.be.equal('請再次確認折扣碼活動時間、活動金額');
      done();
    }
  });

  it('send ShopCode to all users', async (done) => {
    try {
      let shopCode = testShopCode;
      await ShopCodeService.sendAllUsers({shopCode});
      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });

  it('send ShopCode to target users', async (done) => {
    try {
      let shopCode = testShopCode;
      let users = await db.User.findAll({ limit: 5 });
      await shopCode.setUsers(users);

      shopCode = await db.ShopCode.find({
        where: {
          id: shopCode.id
        },
        include: [db.User]
      });

      await ShopCodeService.sendTargetUsers({shopCode});
      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });

  describe('send ShopCode when user Register', (done) => {
    let createdRegisterShopCode;
    before( async (done) => {
      var registerShopCode = {
          title: '測試',
          code: 'YYYYYYYYYYZZZZZZZZZZ',
          autoRandomCode: 'on',
          startDate: moment().add(-1, 'days').toDate(),
          endDate: moment().add(1, 'days').toDate(),
          type: 'price',
          description: 99,
          restriction: 999,
          sentType: 'beginner',
          sentContent: '測試'
        };
      createdRegisterShopCode = await db.ShopCode.create(registerShopCode);
      done();
    });

    it('should be success', async (done) => {
      try {
        let shopCode = testShopCode;
        let user = await db.User.find({ limit: 1 });

        await ShopCodeService.sendWhenRegister({shopCode, user});
        done();
      } catch (e) {
        console.log(e.stack);
        done(e);
      }

    });
  });

});
