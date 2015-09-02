import Promise from "bluebird";
import easyimg from "easyimage";

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
      var resizeConfig = {
        src:imageResizeConfig.src,
        dst: imageResizeConfig.dst || `${__dirname}/../../.tmp/images/${token}.jpg`,
        width: imageResizeConfig.width,
        height: imageResizeConfig.height
      }

      console.log('resizeConfig', resizeConfig);
      let result = await easyimg.resize(resizeConfig);
      return {token, ...result};

    } catch (e) {
      throw e;
    }
  }


};
