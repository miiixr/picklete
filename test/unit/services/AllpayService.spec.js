var Allpay = require('../../../api/services/AllpayService');

describe("about Allpay service", function() {
  it('Create allpay aioCheckOut object', function() {
    try {
			var allpay = new Allpay({
      	merchantID: '2000132',
      	hashKey: '5294y06JbISpM5x9',
      	hashIV: 'v77hoKGq4kWxNNIS',
      	debug: false
    	});
      var data = {
				MerchantTradeNo: 'allpay20150830025',
				TotalAmount: 500,
				TradeDesc: 'Allpay push order test',
				ItemName: ['Item01', 'Item02'],
				ChoosePayment: {name: 'ATM'},
				ReturnURL: 'http://localhost:3000',
				ClientBackURL: 'http://localhost:3000'
			};
      allpay.aioCheckOut(data, function(obj){
				console.log(obj);
			});
    } catch (e) {
      console.log(e);
    }
  });
});
