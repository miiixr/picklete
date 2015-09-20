import Promise from "bluebird";
import easyimg from "easyimage";
import gm from "gm";
import path from 'path';
import fse from 'fs-extra';

var domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
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
        src: imageResizeConfig.src,
        dst: imageResizeConfig.dst || dst,
        width: imageResizeConfig.width || 100,
        height: imageResizeConfig.height || 100
      }
      await fse.ensureDirSync(path.join(home, `./.tmp/images`));
      let result = await gm(resizeConfig.src).resize(resizeConfig.width, resizeConfig.height, "!").writeAsync(resizeConfig.dst);
      return resizeConfig;

    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  processPath: (originPath) => {
    var path = originPath.split(process.cwd())[1];
    path = path.replace('.tmp/', '');
    return path;
  },

  processLoop: async (files, width, height, beArray) => {
    let that = this;
    let buffers = files;

    if ( ! buffers)
      return [];

    if (buffers.length) {
      for (let i in buffers) {
        try {
          await ImageService.resize({
            src: buffers[i].fd,
            dst: buffers[i].fd,
            width: width,
            height: height
          });
        } catch (e) {
          console.error(e);
        }
        buffers[i] = domain + ImageService.processPath(buffers[i].fd);
        buffers[i] = buffers[i].replace('.tmp/', '');
      }
      if (beArray)
        return buffers;

      if (buffers.length > 1)
        return buffers;
      else
        return buffers[0];
    }
  }
};
