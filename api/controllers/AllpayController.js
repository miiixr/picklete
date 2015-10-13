/**
 * Allpay Controller
 */
module.exports = {

  debug : async(req,res) => {
    try {
      //console.log(allpayService);
      res.ok({
        //config: await UrlHelper.resolve(sails.config.allpay.ReturnURL, true)
        config: await OrderService.getAllpayConfig('DEBUG', Date.now(), 999, 'ATM')
      });
    }
    catch (e) {
      console.log(e);
      res.ok({
        error: e
      });
    }
  }
};
