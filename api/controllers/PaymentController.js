/**
 * PaymentController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Allpay = require('../../api/services/AllpayService');
var _ = require('lodash');
var allpay = new Allpay({
  merchantID: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIV: 'v77hoKGq4kWxNNIS',
  debug: false
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
