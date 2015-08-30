
let DptController = {

  create: async(req, res) => {

    var dptData = req.body;

    return db.Dpt.create(dptData)
      .then(function(newDpt) {
        return res.ok(newDpt);
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  },

  list: async(req, res) => {
    return db.Dpt.findAll({
        include: [{
          model: db.Dpt_Sub
        }],
        order: ['weight', 'Dpt_Subs.weight']
      })
      .then(function(dpts) {
        // return res.ok(dpts);
        console.log(dpts);
        res.view('admin/departmentList', { dpts });
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  }

};

module.exports = DptController;