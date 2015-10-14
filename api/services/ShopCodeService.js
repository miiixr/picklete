import moment from 'moment';

module.exports = {
  checkCode : async (code) => {
    try {
      let result = await db.ShopCode.findOne({
        where:{
          code: code
        }
      });
      return result;
    } catch (e) {
      throw e;
    }
  },



  sendWhenRegister: async ({user}) => {
    let shopCodes = await db.ShopCode.findAll({
      where:{
        sentType: 'beginner',
        $or:[{
          restrictionDate: 'on'
        },{
          startDate:{
            $lte: moment(new Date()).format('YYYY/MM/DD')
          },
          endDate:{
            $gte: moment(new Date()).format('YYYY/MM/DD')
          },
        }]
      }
    });

    let users = [user];

    let messageResults = await* shopCodes.map((shopCode) => {
      return ShopCodeService.sendCode({shopCode, users});
    });

    return messageResults;



  },

  use: async ({code, price}) => {
    try {
      let result = await db.ShopCode.findOne({
        where:{
          code: code,
          $or:[{
            restrictionDate: 'on'
          },{
            startDate:{
              $lte: moment(new Date()).format('YYYY/MM/DD')
            },
            endDate:{
              $gte: moment(new Date()).format('YYYY/MM/DD')
            },
          }],
          restriction:{
            $lte: price
          }
        }
      });
      let discountAmount;
      if(result){
        let originPrice = price;
        if(result.type == 'price')
          price -= result.description;
        else
          price *= (result.description*0.01);
        discountAmount = originPrice - price;
      }
      else{
        throw new Error("請再次確認折扣碼活動時間、活動金額");
      }
      return {code, price, discountAmount};
    } catch (e) {
      throw e;
    }
  },

  sendAllUsers: async ({shopCode}) => {
    console.log('=== shopCode ===', shopCode);
    let users = await db.User.findAll();
    await ShopCodeService.sendCode({shopCode, users});

  },

  sendTargetUsers: async ({shopCode}) => {
    console.log('=== shopCode ===', shopCode);
    let users = shopCode.Users;

    await ShopCodeService.sendCode({shopCode, users});
  },

  sendCode: async ({shopCode, users}) => {

    let messages = await* users.map((user) => {
      let messageConfig = CustomMailerService.shopCodeMail({shopCode, user});
      return db.Message.create(messageConfig);
    })

    await* messages.map((message) => CustomMailerService.sendMail(message))

  }
}
