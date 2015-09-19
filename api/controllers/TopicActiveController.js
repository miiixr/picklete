module.exports = {

  list: async(req, res) => {
    let activities = await TopicActiveService.getModel();

    res.view("admin/topicActivities", {
      pageName: "/admin/topicActivities",
      activities
    });
  },

  save: async(req, res) => {
    let topicActives = req.body.activities;
    let result = await TopicActiveService.save(topicActives);
    // console.log(result);
    return res.redirect("/admin/topicActivities");
  }

};
