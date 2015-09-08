module.exports = {
  upload: async (req, res) => {
    req.file("uploadfile").upload((err, files) => {
      return res.ok(files);
    });
  }
};