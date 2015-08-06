OrderController =
  # order building section
  create : (req, res)  ->
    # 1. 透過 Productid 找到 model product --- ok
    # 2. 檢查 user 是否存在，若否進行建立  ---
    # 3. 建立訂單 order                    ---
    # order = {
    #   id: '11223344'
    #   quantity: 10
    #
    #   user: {
    #     username: 'test'
    #     email: 'test@gmail.com'
    #     mobile: '0911-111-111'
    #     address: '台灣省台灣市台灣路'
    #   }
    #
    #   product: {
    #     name: '柚子'
    #     desctipt: '又大又好吃'
    #     stockQuantity: 10
    #     price: 100
    #     id: 1
    #   }
    # }
    ##############################################
    # get params

    console.log 'req.body', req.body
    newOrder = req.body.order
    quantity = newOrder.quantity
    jProduct = newOrder.product
    jUser = newOrder.user
    shipment = newOrder.shipment
    dateFormat = (nowDate) ->
      yyyy = nowDate.getFullYear().toString()
      mm = (nowDate.getMonth() + 1).toString()
      dd = nowDate.getDate().toString()
      return yyyy + (if mm[1] then mm else '0' + mm[0]) + (if dd[1] then dd else '0' + dd[0])
    randomNumber = ->
      maxNum = 9999
      minNum = 0
      return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum


    # outputs
    result = {
      order:null
      success:null
      user:null
      product:null
    }

    # console outputs
    console.log '=====================>'
    console.log ' user:', jUser
    console.log ' product:', jProduct
    console.log '=====================>'

    # step 1 : get product by given id.
    doFindProduct = (done) ->
      db.Product.findById(1).then (findProduct) ->
        #
        console.log '=====================>'
        console.log ' product in db:',findProduct.toJSON();
        console.log '=====================>'
        result.product = findProduct
        #
        return done(msg: '找不到商品！ 請確認商品ID！') if !findProduct
        return done(msg: '商品售鑿！') if findProduct.stockQuantity is 0
        return done(msg: '商品數量不足！') if findProduct.stockQuantity < quantity
        done(null)

    # step 2 : check user whether exists.
    doFindOrCreateUser = (done) ->
      #db.User.findOrCreate({where: {email:jUser.email}, defaults:jUser}).then (thisUser) ->
      db.User.findOne({where: {email:jUser.email}}).then (thisUser) ->
        # if user not exists
        if !thisUser
          console.log 'user not exists. create one ...'
          # create a new user
          db.User.create(jUser).then (createdUser) ->
            if createdUser
              #doCreateOrder(createdUser.id)
              console.log '======================>\n
              new user created. ===>\n',createdUser.get()
              result.user = createdUser
              done(null,createdUser.id)
        # user exists.
        else
          console.log 'find a exist user. id===>',thisUser.id
          result.user = createdUser
          done(null,createdUser.id)

    # step 3 : insert a new order
    doCreateOrder = (done, userid) ->
      # build a order
      theDate = new Date
      newOrder = {
        quantity: quantity,
        UserId : userid,
        SerialNumber: dateFormat(new Date()) + randomNumber()
        # odrer id
        #########################
        #  SerialNumber: theDate.getTime()
        #########################
      }

      # insert the order

      ShipmentService.create shipment, (error, createShipment) ->
        newOrder.shipment = newOrder.id

        db.Order.create(newOrder).then (createdOrder) ->
          if createdOrder
            console.log '======================>\n
            new order includes ==>\n',createdOrder.get()
            result.order = createdOrder
            result.success = true
            done(null)
          else
            result.order = null
            result.success = false
            done(msg: '建立訂單失敗')

    # do works async just in case.
    async.series [
      doFindProduct
      doFindOrCreateUser
      doCreateOrder
    ], (err, results) ->

      ShipmentService.create shipment, (error, createShipment) ->
        console.log '=== createShipment ===', createShipment

        result.order.setShipment(createShipment).then (associatedShipment) ->
          result.order.setProduct(result.product).then (associatedProduct) ->
            result.order.setUser(result.user).then (associatedUser) ->

              resultOrder = result.order.toJSON()
              resultOrder.shipment = createShipment
              resultOrder.user = result.user
              resultOrder.product = result.product

              return res.ok {
                order: resultOrder
                bank: sails.config.bank
                success: result.success
              }

  # order status section
  status:  (req, res) ->
    console.log req.body. SerialNumber
    console.log req.body.email

    db.User.findOne(
      where:
        email:req.body.email
    )
    .then (userData) ->
      return res.ok {msg: '沒有此User' } if userData is null

      db.Order.findOne(
        where:
          SerialNumber:req.body. SerialNumber
          UserId:userData.id
        include: [
          { model: db.User }
          { model: db.Shipment }
          { model: db.Product }
        ]
      )
      .then (orderProduct) ->
        console.log 'orderProduct', orderProduct.toJSON();
        if orderProduct?
          bank = sails.config.bank 
          res.ok {
            order : orderProduct
            bank : bank
          }
        else
          #沒有此訂單編號時在這處理
          res.ok { msg: '沒有此訂單' }


module.exports = OrderController
