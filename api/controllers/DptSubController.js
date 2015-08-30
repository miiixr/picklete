
let DptSubController = {

  create: async(req, res) => {

    var dptSubData = req.body;

    return db.Dpt_Sub.create(dptSubData)
      .then(function(newDptSub) {
        return res.ok(newDptSub);
      })
      .catch(function(error) {
        return res.serverError(error);
      });

  },

  list: async(req, res) => {
    return db.Dpt_Sub.findAll()
      .then(function(dpt_subs) {
        return res.ok(dpt_subs);
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  }

};

module.exports = DptSubController;