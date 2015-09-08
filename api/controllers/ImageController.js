module.exports = {
  upload: async (req, res) => {
    req.file("uploadfile").upload((err, files) => {

      if ( ! files.length)
        return res.ok([]);
      
      for (let i in files) {
        files[i].fd = domain + ImageService.processPath(files[i].fd);
      }
      res.ok(files);
    });
  }
};