let SliderActivitiesController = {
    
  create: async (req, res) => {
  	// console.log('Todo: write data into database');
    var params = req.body;
    // console.log(params);

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
       return res.redirect("/");
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

  	
  // update: async (req, res) => {
  // }

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
