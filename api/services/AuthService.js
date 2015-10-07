import crypto from 'crypto';

module.exports = {
  sendForgotMail : async (email) => {
    try {
      let user = await db.User.findOne({where:{email}});
      user.forgotToken = crypto.randomBytes(32).toString('hex').substr(0, 20);
      await user.save();
      //寄送mail

      // let messageConfig = CustomMailerService.orderConfirm(result);
      // let message = await db.Message.create(messageConfig, {transaction});
      // await CustomMailerService.sendMail(message);
      // 
      return user;
    } catch (e) {
      throw e;
    }
  },

  changeForgotPassword: async ({email, forgotToken}) => {
    try {
      //查詢 user，隨機更換user密碼
      let user = await db.User.findOne({
        where:{
          email,
          forgotToken
        }
      });
      let passport = await db.Passport.findOne({
        where:{
          UserId: user.id
        }
      });
      passport.password = crypto.randomBytes(32).toString('hex').substr(0, 8);
      await passport.save();
      //再次寄送mail
      return {user, passport};
    } catch (e) {
      throw e;
    }
  }
}
