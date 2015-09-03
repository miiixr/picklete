import easyimg from "easyimage";
describe.only("about image service", () => {
  it('resize Image', async (done) => {

    try {

      let imageResizeConfig = {
        src: `${__dirname}/../resources/test.jpg`,
        dst: `${__dirname}/../resources/resize.jpg`,
        width: 100
      }

      let result = await ImageService.resize(imageResizeConfig);

      result.width.should.be.equal(imageResizeConfig.width);
      result.path.should.be.equal(imageResizeConfig.dst);

      done();
    } catch (e) {
      done(e);
    }

  });
  it('resize Image without dst, will save to .tmp/images', async (done) => {

    try {

      let imageResizeConfig = {
        src: `${__dirname}/../resources/test.jpg`,
        width: 100
      }

      let result = await ImageService.resize(imageResizeConfig);
      (result.path.indexOf(result.token) > 0).should.be.true;
      (result.path.indexOf('.tmp/images') > 0).should.be.true;
      result.width.should.be.equal(imageResizeConfig.width);

      done();
    } catch (e) {
      done(e);
    }

  });



});
