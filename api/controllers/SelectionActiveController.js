let SelectionActiveController = {

  list : async (req, res) => {
    let activities = await db.SelectionActive.findAll({include: [db.Image]});
    console.log('===============================');
    console.log(JSON.stringify(activities,null,4));

    res.view("admin/exclusive", {
      pageName: "/admin/exclusive",
      activities: activities
    });
  },

  update : async (req, res) => {
    console.log('++++++++++++++++++++++++++++++++');
    console.log(JSON.stringify(req.body.actives, null, 4));
    let selectionActives = req.body.actives;
    let result = await SelectionActiveService.save(selectionActives);
    // console.log(result);
    return res.redirect("/admin/exclusive");
  }

};
module.exports = SelectionActiveController;
