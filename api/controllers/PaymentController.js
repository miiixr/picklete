/**
 * PaymentController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Allpay = require('../../api/services/AllpayService');
var _ = require('lodash');
var allpay = new Allpay({
  merchantID: sails.config.allpay.merchantID,
  hashKey: sails.config.allpay.hashKey,
  hashIV: sails.config.allpay.hashIV,
  debug: sails.config.allpay.debug,
});

let PaymentController = {
  create: (req, res) => {
    let data = req.body;

    try {
      allpay.aioCheckOut(data, function(result) {
        return res.ok({
          result,
        });
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  list: (req, res) => {
    var data = req.body;

    try {
      allpay.queryTradeInfo(data, function(result) {
        return res.ok({
          result,
        });
      });
    } catch (error) {
      return res.serverError(error);
    }
  },


  paid: async(req, res) => {
    try {
      console.log('req',req.body);
      let data = req.body;
      let checkMacValue = allpay.genCheckMacValue(data);
      let find;
      if(sails.config.environment === 'development' || sails.config.environment === 'test'){
        find = data.MerchantTradeNo.replace(sails.config.allpay.merchantID,"");
        find = find.replace(/\w{8}/,"");
      }
      else{
        find = data.MerchantTradeNo.replace(sails.config.allpay.merchantID ,"");
      }

      let order = await db.Order.findById(find);

      if(!order)
        throw new Error(`${find} 嚴重錯誤!!付款後找不到訂單!!`);

      if (!(sails.config.environment === 'development' || sails.config.environment === 'test')) {
        if(checkMacValue != data.CheckMacValue)
          throw new Error(`CheckMacError!!`);
      }
      order.TradeNo = data.TradeNo;
      order.allPayRtnCode = data.RtnCode;
      order.allPayRtnMsg = data.RtnMsg;
      order.allPayPaymentType = data.PaymentType;
      order.paymentIsConfirmed = true
      order.paymentConfirmDate = data.PaymentDate;
      order.paymentConfirmAmount = data.TradeAmt;
      await order.save();

      return res.ok('1|OK');
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError(message);
    }
  },
};

module.exports = PaymentController;
