
import path from 'path';
describe('Image controller test', () => {

  var cookie;

  before(async (done) => {
    request(sails.hooks.http.app)
    .post('/auth/local')
    .send({ identifier: 'admin', password: 'admin' })
    .end(function (err, res) {
      cookie = res.headers['set-cookie'];
      return done();
    });
  });

  it(' test uplaod a image', (done) => {
    var photo = path.join(process.cwd(), './test/unit/resources/photos1.jpg');

    request(sails.hooks.http.app)
    .post('/admin/image/upload')
    .set('cookie', cookie)
    .attach('uploadfile', photo)
    .end(function(err, res) {
      console.log('res.body', res.body);
      res.body.should.be.String;
      // res.body.should.be.String;

      // res.body.weight.should.be.equal(2);
      // res.body.official.should.be.equal(true);
      // res.body.DptId.should.be.equal(DptFoo.id);
      return done();
    });
  });
});
