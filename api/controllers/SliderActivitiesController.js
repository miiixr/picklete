let SliderActivitiesController = {
    
  create: async (req, res) => {
  	console.log('-----------------------');
    console.log('* hello world controller');
  	console.log('-----------------------');

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
  }

};
module.exports = SliderActivitiesController;
