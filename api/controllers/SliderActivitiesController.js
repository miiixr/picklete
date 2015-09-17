let SliderActivitiesController = {
    
  create: async (req, res) => {
    var params = req.body;

    let slider = {
      cover: params['cover'],
      title: params['title'],
      description: params['description'] || '',
      location: params['location'],
      color: params['color'],
      link: params['link'] || ''
    };

    try {
       await db.Slider.create(slider);
       return res.redirect("/admin/index-slider");
    } catch (e) {
       return res.serverError(e);
    }
  },

  createSlider: async (req, res) => {
  	var params = req.body;

    let slider = {
      cover: params['cover'],
      title: params['title'],
      description: params['description'] || '',
      location: params['location'],
      color: params['color'],
      link: params['link'] || ''
    };

    try {
       let createSlider = await db.Slider.create(slider);
       return res.ok(createSlider);
    } catch (e) {
      let msg = e.message;
      return res.serverError({msg});
    }
  },

  showUpdate: async (req, res) => {

    let id = req.query.id;
    let updateSlider = await db.Slider.findOne({ where: {id: id} });
    
    try {
       return res.view("admin/sliderActivitiesUpdate",{ slider: updateSlider });
    } catch (e) {
       return res.serverError(e);
    }
  },

  update: async (req, res) => {

    try {
      var params = req.body;
      let id = parseInt(req.body['id'] || req.query.id);
      let updateSlider = await db.Slider.findOne({ where: {id: id} });
      
      updateSlider.cover = req.body['cover'];
      updateSlider.title = req.body['title'];
      updateSlider.description = req.body['description'];
      updateSlider.location = req.body['location'];
      updateSlider.color = req.body['color'];
      updateSlider.link = req.body['link'];

    
      await updateSlider.save();
      return res.redirect("/admin/index-slider");
    } catch (e) {
      return res.serverError(e);
    }
  },

  updateSlider: async (req, res) => {
  	
  	let id = req.params.id;
    let updateSlider = await db.Slider.findOne({ where: {id: id} });
    
		updateSlider.cover = req.body['cover'];
		updateSlider.title = req.body['title'];
		updateSlider.description = req.body['description'];
		updateSlider.location = req.body['location'];
		updateSlider.color = req.body['color'];
		updateSlider.link = req.body['link'];

    let updatedSlider = await updateSlider.save();
		return res.ok(updatedSlider);
  },

  list: async (req, res) => {

  	let listSliders = await db.Slider.findAll();
  	return res.view("admin/sliderActivities", { 
  			sliders: listSliders
      });
  },

  listSlider: async (req, res) => {

    let listSliders = await db.Slider.findAll();
		return res.ok(listSliders);
  },

  delete: async (req, res) => {
    
    let id = req.body['id'];

    let slider = await db.Slider.findOne({ where: {id: id} });
    await slider.destroy();
    
    try {
       return res.redirect("/admin/index-slider");
    } catch (e) {
       return res.serverError(e);
    }
  },


  deleteSlider: async (req, res) => {
    
    let id = req.params.id;
    let slider = await db.Slider.findOne({ where: {id: id} });
    await slider.destroy();
    return res.ok(slider);
  }


};
module.exports = SliderActivitiesController;
