let SelectionActiveController = {

  list : async (req, res) => {
    // await db.SelectionActive.destory({include: [db.Image]});
    let activities = await db.SelectionActive.findAll({include: [db.Image]});
    console.log('===============================');
    console.log(JSON.stringify(activities,null,4));

    // return res.ok(brands);
    res.view("admin/exclusive", {
      pageName: "/admin/exclusive",
      activities: activities
    });
  }

};
module.exports = SelectionActiveController;
