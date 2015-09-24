import path from 'path';

describe('SliderActivities Spec', function() {

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


  it('Create a new SliderActivities', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/slider/create')
    // .set('cookie', cookie)
    .field('cover', 'http://cover.jpg') // 活動主圖
    .field('title', '活動標題') // 活動標題
    .field('description', '活動文案') // 活動文案
    .field('location', '文案位置') // 文案位置
    .field('color', '123') // 文案顏色
    .field('link', '活動網址') // 活動網址
    .end(function(err, res) {


      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/index-slider');

      return done();
    });
  });

  it('Create a new SliderActivities using API', (done) => {
      request(sails.hooks.http.app)
        .post('/api/slider/create')
        // .set('cookie', cookie)
        .send({
          cover: 'http://cover.jpg',
          title: '活動標題',
          description: '文案位置',
          location: '123',
          color: '123',
          link: '活動網址'
        })
        .end((err,res) => {

          res.statusCode.should.be.equal(200);
          done(err);

      });
  });

  it('Update an exist SliderActivities', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/slider/update')
    // .set('cookie', cookie)
    .field('id', 1)
    .field('cover', '1http://cover.jpg') // 活動主圖
    .field('title', '1活動標題') // 活動標題
    .field('description', '1活動文案') // 活動文案
    .field('location', 'caption-right caption-top') // 文案位置
    .field('color', '1123') // 文案顏色
    .field('link', 'http://tw.com') // 活動網址
    .end(function(err, res) {
      // console.log('-----------------------');
      // console.log('* Create a new SliderActivities')
      // console.log('-----------------------');

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/index-slider');

      return done();
    });
  });

  it('Update an exist SliderActivities using API', (done) => {
    request(sails.hooks.http.app)
      .post('/api/slider/update/1')
      // .set('cookie', cookie)
      .send({
        cover: '1http://cover.jpg',
        title: '1活動標題',
        description: '1文案位置',
        location: '1123',
        color: '1123',
        link: '1活動網址'
      })
      .end((err,res) => {

        res.statusCode.should.be.equal(200);
        done(err);

    });
  });

  it('Delete an exist SliderActivities', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/slider/delete')
    .field('id', 1)
    // .set('cookie', cookie)
    .end(function(err, res) {

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/index-slider');

      return done();
    });
  });

  it('Delete an exist SliderActivities using API', function(done) {

    request(sails.hooks.http.app)
    .post('/api/slider/delete/2')
    // .set('cookie', cookie)
    .end(function(err, res) {

      res.statusCode.should.be.equal(200);

      return done();
    });
  });

  it('List the all SliderActivities', function(done) {
    request(sails.hooks.http.app)
    .get('/admin/index-slider')
    // .set('cookie', cookie)
    .end(function(err, res) {
      res.statusCode.should.be.equal(200);
      return done();

    });
  });

  it('List the all SliderActivities using API', (done) => {
    request(sails.hooks.http.app)
      .get('/api/slider/list')
      // .set('cookie', cookie)
      .end((err,res) => {

        res.statusCode.should.be.equal(200);
        done(err);

    });
  });

  after( (done) => {
    UserService.getLoginState.restore();
    UserService.getLoginUser.restore();
    done();
  });

});
