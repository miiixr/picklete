import moment from 'moment';
let sprintf = require("sprintf-js").sprintf;
import dataRequest from 'request';
import crypto from 'crypto';


var Allpay = require('../../api/services/AllpayService');
var _ = require('lodash');
var allpay = new Allpay({
  merchantID: sails.config.allpay.merchantID,
  hashKey: sails.config.allpay.hashKey,
  hashIV: sails.config.allpay.hashIV,
  debug: sails.config.allpay.debug,
});

module.exports = {
  generateOrderSerialNumber: async () => {
    let dateString = OrderService._dateFormat(moment());
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(1, 'days').add(-1, 'seconds').toDate();

    let todayOrderConut = await db.Order.count({
      where: {
        createdAt: {
          between: [startDate, endDate]
        }
      }
    })

    let todayOrderConutString = sprintf("%03d", todayOrderConut);

    return `${dateString}${todayOrderConutString}`;

  },

  findAllComplete: async () => {
    let orders = await db.Order.findAll({
      include: [
        {
          model: db.User
        }, {
          model: db.Shipment
        }, {
          model: db.OrderItem
        }
      ]
    });

    return orders;

  },
  findAllByUserComplete: async (userData) => {
    let orders = await db.Order.findAll({
      where: {
        UserId: userData.id
      },
      include: [
        {
          model: db.User
        }, {
          model: db.Shipment
        }, {
          model: db.OrderItem
        }
      ]
    });

    return orders;

  },

  findAllByDateComplete: async (startDate, endDate) => {
    console.log(startDate._d, endDate._d);
    let orders = await db.Order.findAll({
      where: {
        updatedAt: {
          $gt: startDate._d,
          $lt: endDate._d,
        },
      },
      include: [
        {
          model: db.User
        }, {
          model: db.Shipment
        }, {
          model: db.OrderItem
        }
      ]
    });
    return orders;

  },

  find: async (sn) => {
    let orders = await db.Order.findAll({
      where: {
        serialNumber: sn
      }
    });
    return orders;
  },

  allPayCreate: async (order,paymentMethod) => {
    try {
      var time = Date.now();
      let domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
      let orderNo;
      if(sails.config.environment === 'development' || sails.config.environment === 'test'){
        var randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
        orderNo = sails.config.allpay.merchantID + randomString + order.id;
      }else {
        orderNo = sails.config.allpay.merchantID + order.id ;
      }
      let data = {
        MerchantID: sails.config.allpay.merchantID,
        MerchantTradeNo: orderNo,
        MerchantTradeDate: sails.moment(time).format('YYYY/MM/DD HH:mm:ss'),
        PaymentType: 'aio',
        TotalAmount: order.paymentTotalAmount,
        TradeDesc: 'Allpay push order test',
        ItemName: '',
        ReturnURL: domain + sails.config.allpay.ReturnURL,
        ChoosePayment: paymentMethod,
        ClientBackURL:  domain + sails.config.allpay.ClientBackURL,
        PaymentInfoURL:  domain + sails.config.allpay.PaymentInfoURL
      };
      var itemArray = [];
      order.OrderItems.forEach((orderItem) => {
        itemArray.push(orderItem.name);
      });
      data.ItemName = itemArray.join('#');

      // let checkMacValue = await new Promise((done) => {
      //   dataRequest.post( {
    	// 		url: 'http://payment-stage.allpay.com.tw/AioHelper/GenCheckMacValue',
    	// 		form:data,
    	// 		followRedirect: true
    	// 	},(error, res, body) => {
    	// 		done(res.body);
    	// 	})
      // });
      // console.log("!!!",checkMacValue);

      var checkMacValue = allpay.genCheckMacValue(data);
      data.CheckMacValue = checkMacValue;
      return data;

    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  create: async (newOrder) => {
    let result = {};

    try {

      let orderItems = newOrder.orderItems.reduce((result, orderItem) => {
        if(parseInt(orderItem.quantity) === 0) return result;

        result.push(orderItem);

        return result;
      }, [])

      let products = await* orderItems.map(async (orderItem) => {

        let product = await db.Product.findById(orderItem.ProductId);

        if (!product)
          throw new Error('找不到商品！ 請確認商品ID！');

        if (product.stockQuantity === 0)
          throw new Error('商品售鑿！');

        if (product.stockQuantity < orderItem.quantity)
          throw new Error('商品數量不足！');
        product.stockQuantity = product.stockQuantity - orderItem.quantity;

        return product;
      });

      let {user} = newOrder;

      user.address = `${user.zipcode} ${user.city}${user.region}${user.address}`;

      console.log('\n\n=== user ===>\n',user);

      let userFindOrCreateResult = await db.User.findOrCreate({
        where: {
          email: user.email
        },
        defaults: user
      });

      let buyer = userFindOrCreateResult[0];

      let thisOrder = {
        quantity: 0,
        UserId: buyer.id,
        paymentTotalAmount:0,
        serialNumber: await OrderService.generateOrderSerialNumber(),
        useBunusPoint: 0
      };

      products.forEach((product, index) => {
        let quantity = parseInt(orderItems[index].quantity);
        thisOrder.paymentTotalAmount += (orderItems[index].price * quantity);
        thisOrder.quantity += quantity;

        orderItems[index].name = product.name;
        orderItems[index].description = product.description;
        // orderItems[index].price = product.price;
        orderItems[index].comment = product.comment;
        orderItems[index].spec = product.spec;
      });

      let useAllPay = false;
      if(sails.config.useAllPay !== undefined)
          useAllPay = sails.config.useAllPay;
      if(useAllPay){
        // 有用歐付寶的運費運算
        let fee = parseInt(newOrder.shippingFee);
        let shippingFee = await db.Shipping.findAll({
          where:{
            fee
          }
        });
        console.log('=== shippingFee ==>',shippingFee);
        if(shippingFee)
          thisOrder.paymentTotalAmount += fee;
        else
          throw new error ("運費有錯誤！");
      }else{
        if(thisOrder.quantity == 1)
          thisOrder.paymentTotalAmount += 90;
        else
          thisOrder.paymentTotalAmount += (thisOrder.quantity * 60);
      }

      let bonusPoint = await db.BonusPoint.findOne({
        where: {email: user.email}
      });

      if(bonusPoint && newOrder.usedDiscountPoint){
        thisOrder.paymentTotalAmount -= bonusPoint.remain;
        thisOrder.useBunusPoint = bonusPoint.remain;
        bonusPoint.used += bonusPoint.remain;
        bonusPoint.remain = 0;
      }

      let isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      let transaction = await db.sequelize.transaction({isolationLevel});

      try {

        let createdOrderItems = await* orderItems.map((orderItem) => db.OrderItem.create(orderItem));
        await* products.map((product) => product.save({transaction}));
        if(bonusPoint && newOrder.usedDiscountPoint)
          await bonusPoint.save({transaction});

        let createdOrderItemIds = createdOrderItems.map((orderItem) => orderItem.id);

        let {shipment} = newOrder;
        shipment.address = `${shipment.zipcode} ${shipment.city}${shipment.region}${shipment.address}`;

        let createdOrder = await db.Order.create(thisOrder, {transaction});
        let createdShipment = await db.Shipment.create(shipment, {transaction});

        let associatedShipment = await createdOrder.setShipment(createdShipment, {transaction});
        let associatedProduct = await createdOrder.setOrderItems(createdOrderItems, {transaction});
        let associatedUser = await createdOrder.setUser(buyer, {transaction});


        result.products = products;
        result.success = true;
        result.bank = sails.config.bank;

        result.order = createdOrder.toJSON();
        result.order.OrderItems = createdOrderItems;
        result.order.User = buyer;
        result.order.Shipment = createdShipment;

        let useAllPay = false;
        if(sails.config.useAllPay !== undefined)
          useAllPay = sails.config.useAllPay;
        if(!useAllPay){
          let messageConfig = CustomMailerService.orderConfirm(result);
          let message = await db.Message.create(messageConfig, {transaction});
          await CustomMailerService.sendMail(message);
        }

        transaction.commit();

      } catch (e) {
        console.error(e.stack);
        transaction.rollback();
        throw e;
      }

      return result

    } catch (e) {
      throw e;
    }


  },

  _dateFormat: (nowDate) => {
    let years = parseInt(nowDate.format('YY'));
    let month = parseInt(nowDate.format('MM'));
    let day = parseInt(nowDate.format('DD'));

    let alphabet = [
      '0','1','2','3','4',
      '5','6','7','8','9',
      'a','b','c','d','e',
      'f','g','h','i','j',
      'k','l','m','n','o',
      'p','q','r','s','t',
      'u','v','w','x','y',
      'z'];

    let result = `${years}${alphabet[month]}${alphabet[day]}`;

    return result;
  }
}
