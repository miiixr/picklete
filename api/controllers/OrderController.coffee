OrderController =
  create: (req, res) ->

    console.log 'req.params', req.params

    order = {
      id: '11223344'
      name: '柚子'
      desctipt: '又大又好吃'
      stockQuantity: 10
      price: 100

      user: {
        username: 'test'
        email: 'test@gmail.com'
        mobile: '0911-111-111'
        address: '台灣省台灣市台灣路'
      }
    }

    success = true

    res.ok {
      order: order
      success: success
    }

module.exports = OrderController
