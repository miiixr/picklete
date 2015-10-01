
/**
 * Search Controller
 */
let moment = require("moment");

module.exports = /* SearchController */ {

  /**
   * Search Products API
   * /api/search/products/:keywords
   */
  productsJson: async function(req, res) {

    let keywords = req.param('keywords');
    let limit = parseInt(req.param('limit', 100));

    let conditions = {};

    conditions.$or = [];

    let eachKeywords = keywords.split('+');

    for (var i=0; i<eachKeywords.length; i++) {
      let keyword = eachKeywords[i];

      conditions.$or.push({ name: { $like: '%'+keyword+'%' }});
      conditions.$or.push({ description: { $like: '%'+keyword+'%' }});
    }

    let products = await db.Product.findAndCountAll({
      where: conditions,
      limit: limit
    });

    try {
      return res.json({products: products, keywords: keywords, limit: limit});
    }
    catch (error) {
      return res.json({error: error}); //res.serverError(error);
    }
  },
  /**
   * Search Products HTML
   */
  products: async function(req, res) {
    try {

      let keywords = req.param('keywords') || req.param('q');
      let limit = parseInt(req.param('limit', 100));

      let conditions = {};

      conditions.$or = [];

      let eachKeywords = keywords.split('+');

      for (var i=0; i<eachKeywords.length; i++) {
        let keyword = eachKeywords[i];

        conditions.$or.push({ name: { $like: '%'+keyword+'%' } });
        conditions.$or.push({ description: { $like: '%'+keyword+'%' } });
        conditions.$or.push({ country: { $like: '%'+keyword+'%' } });
        conditions.$or.push({ spec: { $like: '%'+keyword+'%' } });

        conditions.$or.push(['`ProductGm`.`name` like ?', '%'+keyword+'%'])
        conditions.$or.push(['`ProductGm`.`explain` like ?', '%'+keyword+'%'])
        conditions.$or.push(['`ProductGm`.`usage` like ?', '%'+keyword+'%'])
        conditions.$or.push(['`ProductGm`.`notice` like ?', '%'+keyword+'%'])
      }

      let products = await db.Product.findAndCountAll({
        subQuery: false,
        include: [{
          required: true,
          model: db.ProductGm
        }],
        where: conditions,
        limit: limit,
        order: [['id', 'ASC']]
      });

      return res.view('main/search', {products: products});
    }
    catch (error) {
      return res.serverError(e);
    }
  }
};
