let SliderActivitiesController = {
    
  create: async (req, res) => {
  	console.log('-----------------------');
    console.log('* hello world controller');
  	console.log('-----------------------');

  	console.log('Todo: write data into database');
    var params = req.body;
    console.log(params);

    return res.redirect("/");

  }

};
module.exports = SliderActivitiesController;
