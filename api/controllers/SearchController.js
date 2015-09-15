
/**
 * Search Controller
 */
let moment = require("moment");

module.exports = /* SearchController */ {

  /**
   * Search Products
   */
  products: async function(req, res) {

    let keywords = req.param('keywords');
    let limit = parseInt(req.param('limit', 100));

    let products = await db.Product.findAndCountAll({
      where: {
        $or: [
          { name: { $like: '%'+keywords+'%' }},
          { description: { $like: '%'+keywords+'%' }}
        ]
      },
      limit: limit
    });

    try {
      return res.json({products: products, keywords: keywords, limit: limit});
    }
    catch (error) {
      return res.json({error: error}); //res.serverError(error);
    }
  }
};
