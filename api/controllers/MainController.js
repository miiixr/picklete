module.exports = {

  index: async (req, res) => {
    try {
      let activities = await SelectionActiveService.getModel();
      let sliders = await db.Slider.findAll();

      res.view("main/index", {
        activities,
        sliders
      });

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  }

}