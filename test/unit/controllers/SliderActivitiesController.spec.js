import path from 'path';

describe('SliderActivities Spec', function() {

  var cookie;

  before(async (done) => {

    request(sails.hooks.http.app)
    .post('/auth/local')
    .send({ identifier: 'admin', password: 'admin' })
    .end(function (err, res) {
      cookie = res.headers['set-cookie'];
      return done();
    });
    // done();

  });


  it('Create a new SliderActivities', function(done) {

    request(sails.hooks.http.app)
    .post('/admin/slider/create')
    .set('cookie', cookie)
    .field('cover', 'http://cover.jpg') // 活動主圖
    .field('title', '活動標題') // 活動標題
    .field('description', '活動文案') // 活動文案
    .field('location', '文案位置') // 文案位置
    .field('color', 123) // 文案顏色
    .field('link', '活動網址') // 活動網址
    .end(function(err, res) {
      console.log('-----------------------');
      console.log('* hello world spec')
      console.log('-----------------------');

      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/');

      return done();
    });
  });

  it('Create a new SliderActivities for API', (done) => {
    request(sails.hooks.http.app)
      .post('/api/slider/create/')
      .set('cookie', cookie)
      .send({
        cover: 'http://cover.jpg',
        title: '活動標題',
        description: '文案位置',
        location: '123',
        color: 123,
        link: '活動網址'
      })
      .end((err,res) => {

        console.log('-----------------------');
        console.log('* hello world spec API')
        console.log('-----------------------');
        console.log(res.body);

        res.statusCode.should.be.equal(200);
            
        done(err);

    });
  });


  // it('Show an exist SliderActivities', function(done) {
  // });

  // it('Update an exist SliderActivities', function(done) {
  // });

  // it('List the all SliderActivities', function(done) {
  // });

});
