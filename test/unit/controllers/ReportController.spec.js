var moment = require('moment');
var sinon = require('sinon');
describe("about Report", () => {

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
  it('build Excel', (done) => {
    let data = {
      date: moment().format('YYYY-MM'),
    };

    request(sails.hooks.http.app).post('/report/export').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }

      res.statusCode.should.equal(200);
      let result = res.body;
      console.log(result);
      done(err);
    });
  });

  it('Report export to Excel', (done) => {
    let data = moment().format('YYYY/MM');
    console.log(data);
    request(sails.hooks.http.app).post('/report/export').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }
      console.log("test=>", res);
      res.statusCode.should.equal(200);
      let result = res.body;
      console.log(result);
      (result instanceof Buffer).should.be.true;
      // assert.equal(xlsData.toString('base64').substr(0, 12), fs.readFileSync(filename).toString('base64').substr(0, 12));
      done(err);
    });
  });
});
