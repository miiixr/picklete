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

    product = {
      id: 2222333
      name: '柚子'
      descript: '又大又好吃'
      stockQuantity: 10
      price: 100
      image: base64data
    }

    res.ok {product: product}

module.exports = ProductController
