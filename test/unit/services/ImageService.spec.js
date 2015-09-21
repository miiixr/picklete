// import easyimg from "easyimage";
import Promise from "bluebird";
import gm from "gm";
import fs from 'fs';
import path from 'path';

describe("about image service", () => {
  it('resize Image', async (done) => {

    try {
      var src = path.join(process.cwd(), './test/unit/resources/test.jpg');
      var dst = path.join(process.cwd(), './test/unit/resources/resize.jpg');

      let imageResizeConfig = {
        src: src,
        dst: dst,
        width: 100,
        height: 100
      };

      let result = await ImageService.resize(imageResizeConfig);

      result.width.should.be.equal(imageResizeConfig.width);
      // result.path.should.be.equal(imageResizeConfig.dst);

      done();
    } catch (e) {
      done(e);
    }

  });
  it('resize Image without dst, will save to .tmp/images', async (done) => {

    try {
      var src = path.join(__dirname, `../resources/test.jpg`);
      let imageResizeConfig = {
        src: src,
        width: 150
      };

      let result = await ImageService.resize(imageResizeConfig);

      // (result.path.indexOf(result.token) > 0).should.be.true;
      // (result.path.indexOf('.tmp/images') > 0).should.be.true;
      result.width.should.be.equal(imageResizeConfig.width);

      done();
    } catch (e) {
      done(e);
    }

  });

  it.skip('use gm to resize', async (done) => {

    let dst = '/Users/caesarchi/workspace/exma/picklete/test/unit/resources/resize.jpg';
    try {
      fs.unlinkSync(dst);
    } catch (e) {
    }


    try {
      Promise.promisifyAll(gm.prototype);

      let result = await gm('./test/unit/resources/test.jpg').resize(120, 120).writeAsync(dst);
      console.log(result);
      done();
      // gm('/Users/caesarchi/workspace/exma/picklete/test/unit/resources/test.jpg')
      // .resize(100, 100)
      // .writeAsync(dst)
      // .then(function (size) {
      //   console.log(size);
      //   done();
      // });
    }catch (e) {
      done(e);
    }
  });



});
