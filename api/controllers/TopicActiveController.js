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
  },

  ajax: async(req, res) => {

    if (req.param('action') == 'getProductPhotoImageUrl') {

      let productUrl = req.param('productUrl');

      let productId = productUrl.split('/').pop();

      try {
        let product = await db.Product.findOne({where: {id: productId}});
        //res.ok(product);
        res.ok({imagePath: product.photos[0]});
      }
      catch (e) {
        res.ok({result: 'error'});
        //console.error('HELP!!!');
        console.error(e);
      }
    }
    else {
      res.ok({});
    }
  }

};
