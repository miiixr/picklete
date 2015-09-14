let SliderActivitiesController = {
    
  create: async (req, res) => {
  	// console.log('Todo: write data into database');
    var params = req.body;
    console.log('------------');
    console.log(params);
    console.log('------------');


    let slider = {
      cover: params['cover'],
      title: params['title'],
      description: params['description'] || '',
      location: params['location'],
      color: params['color'],
      link: params['link'] || ''
    };

		// console.log(slider);

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
		return res.ok(updatedSlider)

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
  }


};
module.exports = SliderActivitiesController;
