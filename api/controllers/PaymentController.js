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

module.exports = {
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
};
