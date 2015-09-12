
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
    .field('filename', 'photos[]')
    .field('width', '50')
    .field('height', '50')
    .attach('uploadfile', photo)
    .end(function(err, res) {
      console.log('res.body', res.body);

      res.body.should.be.String;
      
      var result = JSON.parse(res.text);
      result[0].fd.should.be.String;
      result.filename.should.be.String;
      result.height.should.be.Number;
      result.width.should.be.Number;
      res.body.should.be.String;
      
      return done();
    });
  });
});
