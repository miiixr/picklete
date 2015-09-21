
let DptSubController = {

  create: async(req, res) => {

    var dptSubData = {
      name: req.body.subDptName,
      weight: req.body.weight || 1,
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

  update: async(req, res) => {
    return db.DptSub.update({
      name: req.body.name,
    }, {
      where: {
        id: req.body.id
      }
    })
    .then(function(newDpt) {
      return res.redirect('/admin/department');
    })
    .catch(function(error) {
      return res.serverError(error);
    });

  },

  smDelete: async(req,res) => {
    return db.DptSub.destroy({
      where: {
        id: req.body.id
      }
    })
    .then(function(newDpt) {
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
