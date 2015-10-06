
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

  use: async (data) => {
    try {
      let result = await db.ShopCode.findOne({
        where:{
          code: data.code,
          $or:[{
            restrictionDate: 'on'
          },{
            startDate:{
              $lte: new Date()
            },
            endDate:{
              $gte: new Date()
            },
          }],
          restriction:{
            $lte: data.price
          }
        }
      });
      if(result){
        if(result.type == 'price')
          data.price -= result.description;
        else
          data.price *= (result.description*0.01);
      }
      else{
        throw new Error("請再次確認折扣碼活動時間、活動金額");
      }
      return data;
    } catch (e) {
      throw e;
    }
  }
}
