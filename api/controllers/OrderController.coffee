OrderController =
  create: (req, res) ->

    # 1. 透過 Productid 找到 model product
    # 2. 檢查 user 是否存在，若否進行建立
    # 3. 建立訂單 order

    order = {
      id: '11223344'
      quantity: 10

      user: {
        username: 'test'
        email: 'test@gmail.com'
        mobile: '0911-111-111'
        address: '台灣省台灣市台灣路'
      }

      product: {
        name: '柚子'
        desctipt: '又大又好吃'
        stockQuantity: 10
        price: 100
        id: 1
      }
    }

    success = true

    res.ok {
      order: order
      success: success
    }

module.exports = OrderController
