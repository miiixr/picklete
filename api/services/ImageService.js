import Promise from "bluebird";
import easyimg from "easyimage";
import gm from "gm";
import path from 'path';
let home = process.cwd();
Promise.promisifyAll(gm.prototype);

module.exports = {
  upload: async (req, uploadInput) => {
    return new Promise((resolve, reject) => {
      async.map(uploadInput, (file, cb) => {
        req.file(file).upload((err, files) => {
          return cb(err, files);
        });
      }, (err, files) => {
        if (err) return reject(err);
        return resolve(files);
      });
    });
  },
  resize: async (imageResizeConfig) => {

    try {
      var token = await UtilService.generateHashCode();
      var dst = path.join(home, `./.tmp/images/resize.jpg`);
      var resizeConfig = {
        src:imageResizeConfig.src,
        dst: imageResizeConfig.dst || dst,
        width: imageResizeConfig.width || 100,
        height: imageResizeConfig.height || 100
      }

      let result = await gm(resizeConfig.src).resize(resizeConfig.width, resizeConfig.height).writeAsync(resizeConfig.dst);
      return resizeConfig;

    } catch (e) {
      console.log("-----XXD")
      console.log(e);
      throw e;
    }
  }


};
