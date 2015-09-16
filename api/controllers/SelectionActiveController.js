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
    // console.log(result);
    return res.redirect("/admin/exclusive");
  },

  index: async (req, res) => {
    try {
      let activities = await SelectionActiveService.getModel();
      console.log("!!",activities[0]);
      res.view("main/index", {
        pageName: "/index",
        activities
      });
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  }

};
module.exports = SelectionActiveController;
