
let MessageController = {

  list: async(req, res) => {
    return db.Message.findAll()
      .then(function(msgs) {
        res.view('admin/messageList', { msgs });
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  }

};

module.exports = MessageController;
