module.exports = {
  index: async (req, res) => {
    try {
      let selectionActivities = await SelectionActiveService.getModel();
      let sliders = await db.Slider.findAll();
      let topicActivities = await TopicActiveService.getModel();
      let flashPromotions = await PromotionService.getModel();
      res.view("main/index", {
        selectionActivities,
        topicActivities,
        sliders,
        flashPromotions
      });

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  }
}
