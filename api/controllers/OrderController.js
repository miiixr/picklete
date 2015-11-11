// # 1. 透過 Productid 找到 model product
// # 2. 檢查 user 是否存在，若否進行建立
// # 3. 建立訂單 order
var OrderController;


OrderController = {
  debug: async (req, res) => {
    try {
      res.ok(await db.Order.findAll({limit: 3, order: 'id DESC'}));
    }
    catch (error) {
      return res.serverError(error);
    }
  },
  index: async (req, res) => {
    try {
      console.log('query',req.query);
      let query = req.query;
      let queryObj = {};
      let queryShipmentObj = {};
      let queryUserObj = {};

      if(query.serialNumber)
        queryObj.serialNumber = { 'like': '%'+query.serialNumber+'%'};
      else
        query.serialNumber =''

      // if(query.keyword)
      //   queryObj.keyword = { 'like': '%'+query.keyword+'%'};

      if(query.userName) {
        queryUserObj.username = { 'like': '%'+query.userName+'%'};
      }else{
        queryUserObj.username = { 'like': '%'};
        query.username = ''
      }
      if(query.status != '0' && query.status )
        queryObj.status = query.status;
      else
        query.status = 0;

      // if(query.shipmentNotify != '0' && query.shipmentNotify)
      //   queryObj.shipmentNotify = query.shipmentNotify;

      if(query.shippingMethod != '0' && query.shippingMethod){
        if(query.shippingMethod == 1){
          queryShipmentObj.shippingType = { 'like': 'postoffice'};
        }else if(query.shippingMethod == 2){
          queryShipmentObj.shippingType = { 'like': 'delivery'};
        }
      }

      if(query.addressee) {
        queryShipmentObj.username = { 'like': '%'+query.addressee+'%'};
      }else{
        queryShipmentObj.username = { 'like': '%'};
        query.username = ''
      }

      if(query.createdStart && query.createdEnd) {
         queryObj.createdAt = { between : [new Date(query.createdStart), new Date(query.createdEnd)]};
      }else if(query.createdStart || query.createdEnd) {
        queryObj.createdAt = query.createdStart? { gte : new Date(query.createdStart)}: { lte : new Date(query.createdEnd)};
      }

      let page = req.session.UserController_controlMembers_page =
      parseInt(req.param('page',
        req.session.UserController_controlMembers_page || 0
      ));

      let limit = req.session.UserController_controlMembers_limit =
      parseInt(req.param('limit',
        req.session.UserController_controlMembers_limit || 10
      ));

      queryObj = {
        where: queryObj,
        offset: page * limit,
        limit: limit,
        order: 'createdAt DESC',
        include: [
          {
            model: db.User,
            where:{
              username: queryUserObj.username
            }
          }, {
            model: db.Shipment,
            where: queryShipmentObj
          }, {
            model: db.OrderItem
          },
          db.Invoice
        ]
      };

      let orders = await db.Order.findAndCountAll(queryObj);

      return res.view({orders,query,page,limit});
    } catch (error) {
      return res.serverError(error);
    }
  },
  paymentConfirm: async (req, res) => {
    try {
      let order = await db.Order.findOne({
        where: {
          serialNumber: req.query.serial
        }
      });
      if (!order) {
        throw ('order not found')
      }

      // 預設匯款日期今天
      if (!order.paymentConfirmDate) {
        order.paymentConfirmDate = Date.now();
      }

      //console.log(order.paymentConfirmDate);

      return res.view({order});
    } catch (error) {
      return res.serverError(error);
    }
  },
  paymentConfirmSave: async (req, res) => {
    try {
      let order = await db.Order.findOne({
        where: {
          serialNumber: req.query.serial
        }
      });
      if (!order) {
        res.serverError('order not found');
        throw ('order not found');
      }
      order.paymentIsConfirmed = true;
      order.paymentConfirmDate = req.body.paymentConfirmDate;
      order.paymentConfirmName = req.body.paymentConfirmName;
      order.paymentConfirmPostfix = req.body.paymentConfirmPostfix;
      order.paymentConfirmAmount = req.body.paymentConfirmAmount;
      order.save();
      return res.json({
        result: true
      });
    } catch (error) {
      return res.serverError(error);
    }
  },
  create: async (req, res) => {
    var newOrder = req.body.order;

    try {

      console.log("Order",newOrder);

      let useAllPay = false;

      if (sails.config.useAllPay !== undefined) {
        useAllPay = sails.config.useAllPay;
      }

      let result = await OrderService.create(newOrder);

      console.log('***************');
      console.log(JSON.stringify(result,null,2));
      if(result.order.paymentTotalAmount <=0)
        throw new Error ('結帳金額異常');

      if (useAllPay) {
        var allPayData = await OrderService.allPayCreate(result.order,newOrder.paymentMethod);

        console.log("allPayData", allPayData);

        let order = await db.Order.findById(result.order.id);
        order.merchantTradeNo = allPayData.MerchantTradeNo;
        order.allPayPaymentType = newOrder.paymentMethod;
        await order.save();

        let AioCheckOut = 'https://payment.allpay.com.tw/Cashier/AioCheckOut';
        if(sails.config.environment === 'development' || sails.config.environment === 'test' || sails.config.allpay.debug){
          AioCheckOut = 'https://payment-stage.allpay.com.tw/Cashier/AioCheckOut';
        }

        // todo: 清空購物車
        res.clearCookie('picklete_cart');

        res.view('order/allPay',{
          allPayData,
          AioCheckOut
        });
      }
      else{
        return res.ok(result);
      }
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.json(500,{message, success});
      // return res.serverError({message, success});
    }
  },
  pay: async (req, res)=> {
    try {
      var id = req.query.id;
      let orderData = await db.Order.findOne({
        where: {id},
        include:{
            model: db.OrderItem
          }
      });

      if (!orderData) {
        return res.serverError({
          msg: '再確認一下喔，驗證碼錯誤哟 :)！'
        });
      }
      console.log("!!!",orderData);
      var allPayData = await OrderService.allPayCreate(orderData);
      res.view('order/allPay',{
        allPayData
      });

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  orderCancel: async function(req, res) {
    var id = req.query.id;
    var status = req.query.status;

    if (status !== "orderCancel" || id == 0) {
      let message = 'status error';
      let success = false;
      return res.json(500,{message, success});
    }


    try {
      // update order status
      let orderData = await db.Order.findOne({
        where: {serialNumber: id},
        include: [
          {
            model: db.User
          }, {
            model: db.Shipment
          }, {
            model: db.OrderItem
          },
          db.Invoice
        ]
      });

      if (! orderData)
        return res.json(500,{success: false});

      orderData.status = status;
      await orderData.save();

      // send mail to user
      let messageConfig = await CustomMailerService.orderCancel(orderData);

      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);
      return res.json({
        result: true
      });


    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.json(500,{message, success});
    }
  },

  // 查詢
  status: async function(req, res) {

    try{

      var email = req.query.email;
      let userData = await db.User.findOne({
        where: {email}
      });

      if (!userData) {
        return res.serverError({
          msg: '再確認一下喔，驗證碼錯誤哟 :)！'
        });
      }

      let purchaseHistory = await OrderService.findAllByUserComplete(userData);
      console.log('=== purchaseHistory ==>',purchaseHistory);
      return res.ok({purchaseHistory});

    } catch (error) {
      console.log ('error',error.stack);
      return res.serverError(error);
    }
  },

  // get order status
  find: async function(req,res){
    try{
      let sn  = req.param('serialNumber');
      let orders = await OrderService.find(sn);
      console.log('=== order ==>',order);
      if (!orders) {
        throw ('order not found')
      }
      return res.ok({orders});
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  },

  sync: async (req, res) => {
    try {
      var email = req.query.email;
      var host = req.query.host || null;
      var user = await db.User.find({where: {email}});

      var token = await UtilService.generateHashCode();

      user.orderSyncToken = token;
      await user.save();

      let messageConfig = await CustomMailerService.orderSync(user, host);

      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      let {syncLink, syncLinkHost, syncLinkParams} = messageConfig;


      let success = true;
      res.ok({success, syncLink, syncLinkHost, syncLinkParams});

    } catch (e) {
      console.error(e.stack);
      let {message} = e;

      res.serverError({message, success: false});
    }
  },

  statusUpdate: async (req, res) => {

    let id = req.param("id");
    let status = req.query.status;

    try {
      let order = await db.Order.find({
        where: {id},
        include: [{model: db.User}]
      });;

      if (order.status === status){
        req.flash('message', `訂單 ${order.serialNumber} 狀態已為 ${status}`);
        res.redirect('/admin/order');
        return
      }
      else if(order.status == 'deliveryConfirm' && status == 'paymentConfirm'){
        req.flash('message', `訂單 ${order.serialNumber} 狀態已為 ${order.status} 無法變更為 ${status}`);
        res.redirect('/admin/order');
        return
      }

      order.status = status;

      await order.save();

      let messageConfig = await CustomMailerService[status](order);

      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);


      req.flash('message', `訂單 ${order.serialNumber} 狀態更新為 ${status} 成功`);
      res.redirect('/admin/order');
      return


    } catch (e) {
      console.error(e.stack);
      let {message} = e;

      res.serverError({message, success: false});
    }
  },

  bonus: async (req, res) => {
    try{
      console.log('bonus',req.query);
      var email = req.query.email;
      let bonusPoint = await db.BonusPoint.findOne({
        where: {email}
      });
      if (!bonusPoint) {
        throw new Error ('bonus not found')
      }
      res.ok({bonusPoint});
    }catch(e){
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  },

  print: async (req, res) =>{
    var id = req.query.id;
    var orderId = id.split(',');

    var queryObj ={
      where:{
        id : orderId
      },
      include: [
        {
          model: db.User
        },{
          model: db.Shipment
          // where: queryShipmentObj
        },{
          model: db.OrderItem,
          include: db.Product
        },{
          model: db.Invoice
        }
      ]
    };

    let orders = await db.Order.findAll(queryObj);
    console.log(orders.Shipment);
    return res.view('admin/print',{
      orders
    });
  }

};

module.exports = OrderController;
