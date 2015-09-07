// # 1. 透過 Productid 找到 model product
// # 2. 檢查 user 是否存在，若否進行建立
// # 3. 建立訂單 order
var OrderController;

OrderController = {
  index: async (req, res) => {
    try {
      let query = req.query;
      let queryObj = {};
      if(query.serialNumber) {
        queryObj.serialNumber = query.serialNumber;
      }
      if(query.shippingMethod != '0' && query.shippingMethod) {
        queryObj.shippingMethod = query.shippingMethod;
      }
      // if(query.keyword) {
      //   queryObj.keyword = { 'like': '%'+query.keyword+'%'};
      // }
      if(query.userName) {
        // userName = { 'like': '%'+query.userName+'%'};
        let UserIds = await db.User.findAll({
          where: {
            username : { 'like': '%'+query.userName+'%'}
          }
        });
        var id = [];
        UserIds.forEach((User, index) => {
          id.push(User.dataValues.id);
        });
        queryObj.UserId = id;
      }
      if(query.status != '0' && query.status ) {
        queryObj.status = query.status;
      }
      // if(query.shipmentNotify != '0' && query.shipmentNotify) {
      //   queryObj.shipmentNotify = query.shipmentNotify;
      // }
      // if(query.addressee) {
      //   queryObj.addressee = { 'like': '%'+query.addressee+'%'};
      // }
      if(query.createdStart && query.createdEnd) {
         queryObj.createdAt = { between : [new Date(query.createdStart), new Date(query.createdEnd)]};
      }else if(query.createdStart || query.createdEnd) {
        queryObj.createdAt = query.createdStart? { gte : new Date(query.createdStart)}: { lte : new Date(query.createdEnd)};
      }
      console.log('queryObj',queryObj);
      queryObj = {
        where: queryObj,
        include: [
          {
            model: db.User
          }, {
            model: db.Shipment
          }, {
            model: db.OrderItem
          }
        ]
      };

      let orders = await db.Order.findAll(queryObj);
      return res.view({orders,query});
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
        throw ('order not found')
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

      let result = await OrderService.create(newOrder);

      return res.ok(result);
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },
  // 查詢
  status: async function(req, res) {

    try{

      var orderSyncToken = req.query.token;
      let userData = await db.User.findOne({
        where: {orderSyncToken}
      });

      if (!userData) {
        return res.serverError({
          msg: '再確認一下喔，驗證碼錯誤哟 :)！'
        });
      }

      let purchaseHistory = await OrderService.findAllByUserComplete(userData);

      return res.ok({purchaseHistory});

    } catch (error) {
      console.log ('error',error.stack);
      return res.serverError(error);
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

      let messageConfig = CustomMailerService.orderSync(user, host);

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
  }

};

module.exports = OrderController;
