ProductController =
  read: (req, res) ->

    product = {
      id: 2222333
      name: '柚子'
      desctipt: '又大又好吃'
      stockQuantity: 10
      price: 100
    }

    res.ok {product: product}

module.exports = ProductController
