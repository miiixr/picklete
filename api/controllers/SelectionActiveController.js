let SelectionActiveController = {

  list : async (req, res) => {
    let activities = await SelectionActiveService.getModel();
    //db.SelectionActive.findAll({include: [db.Image]});
    res.view("admin/exclusive", {
      pageName: "/admin/exclusive",
      activities
    });
  },

  update : async (req, res) => {
    let selectionActives = req.body.actives;
    let result = await SelectionActiveService.save(selectionActives);
    return res.redirect("/admin/exclusive");
  }

};
module.exports = SelectionActiveController;
