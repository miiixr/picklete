let domain = sails.config.domain || process.env.domain || 'http://localhost:1337';

module.exports = {
  upload: async (req, res) => {
    req.file("uploadfile").upload((err, files) => {
      console.log(files)

      if ( ! files.length)
        return res.ok([]);
      
      for (let i in files) {
        files[i].fd = domain + ImageService.processPath(files[i].fd);
      }
      res.ok(files);
    });
  }
};