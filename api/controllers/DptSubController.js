
let DptSubController = {

  create: async(req, res) => {

    var dptSubData = {
      name: req.body.subDptName,
      weight: req.body.wieght || 1,
      official: false,
      DptId: req.body.dptId
    };

    return db.DptSub.create(dptSubData)
      .then(function(newDptSub) {
        return res.redirect('/admin/department');
      })
      .catch(function(error) {
        return res.serverError(error);
      });

  },

  list: async(req, res) => {
    return db.DptSub.findAll()
      .then(function(dpt_subs) {
        return res.ok(dpt_subs);
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  }

};

module.exports = DptSubController;