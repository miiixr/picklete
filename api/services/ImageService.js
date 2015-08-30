import Promise from "bluebird";

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
  }
};