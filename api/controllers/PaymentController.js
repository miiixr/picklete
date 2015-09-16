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
      let find = data.MerchantTradeNo.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,"$1-$2-$3-$4-$5");
      let order = await db.Order.findById(find);
      if(order)
        console.log("!!!",order);
      else
        throw new Error(`${find} 嚴重錯誤!!付款後找不到訂單!!`);

      var checkMacValue = allpay.genCheckMacValue(data);
      return res.ok('OK');
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError({message, success: false});
    }
  },
};

module.exports = PaymentController;
