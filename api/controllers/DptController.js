
let DptController = {

  update: async(req, res) => {
    return db.Dpt.update({
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


  list: async(req, res) => {
    return db.Dpt.findAll({
        include: [{
          model: db.DptSub
        }],
        order: ['Dpt.weight', 'DptSubs.weight']
      })
      .then(function(dpts) {
        res.view('admin/departmentList', {
           dpts,
           pageName: '/admin/department'
        });
      })
      .catch(function(error) {
        return res.serverError(error);
      });
  },

  sortable: async(req,res) => {

    var sort = req.body.sort;
    var id = req.body.id;
    
    for (var index in id){
     await db.Dpt.update({
      weight: sort[index],
      },{
        where: {
          id: id[index]
        }
      });
     };
  }
};

module.exports = DptController;
