import path from 'path';

describe('ShopCode Spec', function() {

  var cookie;

  import sinon from 'sinon';
  before( async (done) => {
    let admin = db.User.find ({
      where: {username: 'admin'},
      include: [db.Role]
    });
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });
    sinon.stub(UserService, 'getLoginUser', (req) => {
      return admin;
    });
    return done();
  });


  it('Create a new ShopCode', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/shop-code/create')
    .field('code', '優惠代碼') // 優惠代碼
    .field('title', '優惠名稱') // 優惠名稱
    .field('type', 'price') // 優惠類型 price, discount
    .field('description', '200') // 優惠內容
    .field('restriction', '300') // 限滿額
    .field('startDate', '2012/03/16 12:03:12') // 開始時間
    .field('endDate', '2012/03/16 12:03:12') // 結束時間
    .field('sent', 'false') // 自動發送
    .field('content', '發送內容') // 發送內容
    .end(function(err, res) {

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/shop-code');

      return done();
    });
  });

  it('Update an exist ShopCode', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/shop-code/update')
    .field('id', 1)
    .field('code', '1優惠代碼') // 優惠代碼
    .field('title', '1優惠名稱') // 優惠名稱
    .field('type', 'price') // 優惠類型 price, discount
    .field('description', '1200') // 優惠內容
    .field('restriction', '1300') // 限滿額
    .field('startDate', '2012/03/16 12:03:12') // 開始時間
    .field('endDate', '2012/03/16 12:03:12') // 結束時間
    .field('sent', 'false') // 自動發送
    .field('content', '1發送內容') // 發送內容
    .end(function(err, res) {

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/shop-code');

      return done();
    });
  });

  it('List the all ShopCode', function(done) {
    request(sails.hooks.http.app)
    .get('/admin/shop-code')
    .end(function(err, res) {

      res.statusCode.should.be.equal(200);
      return done();

    });
  });


  after( (done) => {
    UserService.getLoginState.restore();
    UserService.getLoginUser.restore();
    done();
  });

});
