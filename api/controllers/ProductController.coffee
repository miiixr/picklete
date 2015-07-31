fs = require 'fs'
mime = require("mime");
util = require("util")

ProductController =
  findOne: (req, res) ->
    productId = req.param("productId")
    console.log '=== productId ===', productId

    src = __dirname + '/../../assets/images/product/1.jpg';

    data = fs.readFileSync(src).toString("base64");
    base64data = util.format("data:%s;base64,%s", mime.lookup(src), data);

    db.Product.findOne({
      where: {
        id: productId
      }
    }).then (product) ->
      return res.ok {product: product}

module.exports = ProductController
