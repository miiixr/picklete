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

  expendCode: async (code, buyer) => {
    try {
      let shopcode = await db.ShopCode.findOne({
        where:{
          code: code,
        }
      });

      // console.log('---- shop code query, expendCode -----')
      // console.log(shopcode);

      // console.log('---- user data, expendCode -----')
      // console.log(buyer);

      let user = await db.User.findOne({
        where:{
          id: buyer.id
        }
      });

      // let result = await shopcode.setUsers(user);
      user.setShopCodes(shopcode.dataValues.id);
      console.log(' ---- save shop code usage ----');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  use: async ({code, price, user}) => {
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

      if ( ! user) {
        throw new Error("使用優惠碼前請先登入");
      }

      let used = await await db.User.findOne({
        where:{
          id: user.id
        },
        include: [{
          model: db.ShopCode,
          where: {
            code: code
          }
        }]
      });

      // console.log('-- used --');
      // console.log(used);

      if (used) {
        throw new Error("您已經使用過此優惠碼");
      }

      let discountAmount;
      if(result){
        let originPrice = price;
        if(result.type == 'price')
          price -= result.description;
        else{
          if(result.description>10){
            result.description *= 0.1;
          }
          price = Math.ceil(price * (result.description*0.1));
        }
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
