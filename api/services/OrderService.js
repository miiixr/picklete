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

var self = module.exports = {
  generateOrderSerialNumber: async () => {
    // let dateString = OrderService._dateFormat(moment());
    let dateString = 'W'+moment().format('YYYYMMDD');
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(1, 'days').add(-1, 'seconds').toDate();

    let todayOrderConut = await db.Order.count({
      where: {
        createdAt: {
          between: [startDate, endDate]
        }
      }
    })

    let todayOrderConutString = sprintf("%05d", todayOrderConut);
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

      if (sails.config.environment === 'development' || sails.config.environment === 'test'|| sails.config.allpay.debug){
        var randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
        orderNo = sails.config.allpay.merchantID + randomString + order.id;
      }
      else {
        orderNo = sails.config.allpay.merchantID + order.id ;
      }

      //remember: keep TradeNo always sync in order object
      await self.update(order.id, {TradeNo: orderNo});

      let data = await self.getAllpayConfig(
        orderNo, time, order.paymentTotalAmount, paymentMethod);

      var itemArray = [];
      let orderItemProducts = await* order.OrderItems.map(async (orderItem) => {
        let orderItemProduct = await db.Product.findOne({
          where:{
            id: orderItem.ProductId
          },
          include:{
            model: db.ProductGm
          }
        })
        return {orderItemProduct,orderItem};
      });

      orderItemProducts.forEach((order) =>{
        sails.log.info(order);
        itemArray.push(`${order.orderItem.name}X${order.orderItem.quantity}`);
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
      //return res.serverError({message, success});
      return null;
    }
  },

  create: async (newOrder) => {
    let result = {};
    sails.log.info("==== newOrder ===",newOrder);
    try {
      if (! newOrder.orderItems)
        throw new Error('無購買任何商品，請跳轉商品頁');

      let orderItems = newOrder.orderItems.reduce((result, orderItem) => {
        if(parseInt(orderItem.quantity) === 0) return result;

        result.push(orderItem);

        return result;
      }, [])

      let products = await* orderItems.map(async (orderItem) => {

        let product = await db.Product.findOne({
          where:{
            id: orderItem.ProductId
          },
          include:{
            model: db.ProductGm
          }
        });

        if (!product)
          throw new Error('找不到商品！ 請確認商品ID！');

        let productName = (product.name == null || product.name == '') ? "" : "(" + product.name + ")";
        productName = product.ProductGm.name + productName;

        if (product.stockQuantity === 0){
          // mix productGm and product name
          throw new Error('此商品「'+ productName +'」已經售鑿！');
        }

        if (product.stockQuantity < orderItem.quantity){
          // mix productGm and product name
          throw new Error('此商品「'+ productName +'」已經不足！請至購物車修改。');
        }

        // fixed to save product full name ( product full name = productGM.name + product.name)
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
        useBunusPoint: 0,
        packingFee: newOrder.packingFee || 0,
        packingQuantity: newOrder.packingQuantity,
        description: newOrder.description
      };
      // 計算購買商品價格
      products.forEach((product, index) => {

        let productName = (product.name == null || product.name == '') ? "" : "(" + product.name + ")";
        productName = product.ProductGm.name + productName;

        let quantity = parseInt(orderItems[index].quantity,10);
        thisOrder.paymentTotalAmount += (orderItems[index].price * quantity);
        thisOrder.quantity += quantity;

        orderItems[index].name = productName;
        orderItems[index].description = product.description;
        // orderItems[index].price = product.price;
        orderItems[index].comment = product.comment;
        orderItems[index].spec = product.spec;
        orderItems[index].productNumber = product.productNumber;

        if(orderItems[index].packingQuantity)
          orderItems[index].packingFee = parseInt(orderItems[index].packingQuantity,10) * 60;
      });
      // 使用折扣碼
      if(newOrder.shopCode){
        var shopCodeData = {
          code: newOrder.shopCode,
          price: thisOrder.paymentTotalAmount
        }
        let shopCode = await ShopCodeService.checkCode(shopCodeData.code);
        if(shopCode){
          let shopCodeDiscount = await ShopCodeService.use(shopCodeData);
          thisOrder.paymentTotalAmount = shopCodeDiscount.price;
          thisOrder.ShopCodeId = shopCode.id;
        }
      }
      // 計算加價購
      let getBuyMore;
      if(newOrder.additionalPurchasesItem){

        getBuyMore = await AdditionalPurchaseService.cartAddAdditionalPurchases(newOrder.additionalPurchasesItem);
        getBuyMore.additionalPurchasesItems.forEach((purchasesItem)=>{

          let purchasesItemData = {
            quantity: 1,
            name: purchasesItem.Products[0].name,
            description: purchasesItem.Products[0].description,
            comment: purchasesItem.Products[0].comment || '',
            spec: purchasesItem.Products[0].spec || '',
            productNumber: purchasesItem.Products[0].productNumber,
            ProductId: purchasesItem.Products[0].id
          };

          if(purchasesItem.type == 'reduce'){
            purchasesItemData.price = purchasesItem.Products[0].price - purchasesItem.reducePrice;
          }else{
            if(purchasesItem.discount > 10)
              purchasesItemData.price = purchasesItem.Products[0].price * (purchasesItem.discount * 0.01);
            else
              purchasesItemData.price = purchasesItem.Products[0].price * (purchasesItem.discount * 0.1);
          }

          orderItems.push(purchasesItemData);

          if (purchasesItem.Products[0].stockQuantity === 0){
            throw new Error('此商品「'+ purchasesItem.Products[0].name +'」已經售鑿！');
          }
          purchasesItem.Products[0].stockQuantity --;
          products.push(purchasesItem.Products[0]);
        });

        thisOrder.paymentTotalAmount += getBuyMore.buyMoreTotalPrice;
      }

      // 計算運費
      let useAllPay = false;
      if(sails.config.useAllPay !== undefined)
          useAllPay = sails.config.useAllPay;
      if(useAllPay){
        // 有用歐付寶的運費運算, to fixed fee is parseInt error or NaN
        if(thisOrder.paymentTotalAmount < 390){
          let fee = parseInt(newOrder.shipment.shippingFee, 10);
          fee = fee || 0;
          let shippingFee = await db.Shipping.findOne({
            where:{
              fee
            }
          });
          console.log('=== shippingFee ==>',shippingFee);
          if(shippingFee)
            thisOrder.paymentTotalAmount += fee;
          else
            throw new error ("運費有錯誤！");
        }
      }else{
        if(thisOrder.quantity == 1)
          thisOrder.paymentTotalAmount += 90;
        else
          thisOrder.paymentTotalAmount += (thisOrder.quantity * 60);
      }

      //計算包裝費
      orderItems.forEach((item) => {
        if(item.packingQuantity){
          thisOrder.paymentTotalAmount +=  parseInt(item.packingQuantity,10) * 60;
        }
      });

      // 計算紅利點數
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

        let {shipment, invoice} = newOrder;
        // shipment fee
        // when user is for him self.
        if (shipment.zipcode == '') {
          shipment.zipcode = user.zipcode;
          shipment.city = user.city;
          shipment.region = user.region;
        }
        shipment.address = `${shipment.zipcode} ${shipment.city}${shipment.region}${shipment.address}`;

        let createdOrder = await db.Order.create(thisOrder, {transaction});
        let createdShipment = await db.Shipment.create(shipment, {transaction});
        let createdInvoice = await db.Invoice.create(invoice, {transaction});

        let associatedShipment = await createdOrder.setShipment(createdShipment, {transaction});
        let associatedInvoice = await createdOrder.setInvoice(createdInvoice, {transaction});
        let associatedProduct = await createdOrder.setOrderItems(createdOrderItems, {transaction});
        let associatedUser = await createdOrder.setUser(buyer, {transaction});


        result.products = products;
        result.success = true;
        result.bank = sails.config.bank;

        result.order = createdOrder.toJSON();
        result.order.OrderItems = createdOrderItems;
        result.order.User = buyer;
        result.order.Shipment = createdShipment;

        if(newOrder.additionalPurchasesItem)
          result.order.additionalPurchasesItems = getBuyMore.additionalPurchasesItems;

        let useAllPay = false;
        if(sails.config.useAllPay !== undefined)
          useAllPay = sails.config.useAllPay;
        if(!useAllPay){
          let messageConfig = await CustomMailerService.orderConfirm(result);
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

  getAllpayConfig: async (tradeNo, tradeDate, totalAmount, paymentMethod) => {
  	return {
  		MerchantID: sails.config.allpay.merchantID,
  		MerchantTradeNo: tradeNo,
  		MerchantTradeDate: sails.moment(tradeDate).format('YYYY/MM/DD HH:mm:ss'),
  		PaymentType: 'aio',
  		TotalAmount: totalAmount,
  		TradeDesc: 'Allpay push order test',
  		ItemName: '',
  		ReturnURL: await UrlHelper.resolve(sails.config.allpay.ReturnURL, true),
  		ChoosePayment: paymentMethod,
  		ClientBackURL: await UrlHelper.resolve(sails.config.allpay.ClientBackURL, true) + '?t=' + tradeNo,
  		PaymentInfoURL: await UrlHelper.resolve(sails.config.allpay.PaymentInfoURL, true)
  	};
  },

  update: async (orderId, data) => {
    let order = await db.Order.findById(orderId);
    //todo: apply all fields
    order.TradeNo = data.TradeNo;
    await order.save();
    return order;
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
