
module.exports = {
  sendForgotMail : async (email) => {
    try {
      //查詢 user，新增forgotToken
      let user;
      //寄送mail
      return user;
    } catch (e) {
      throw e;
    }
  },

  changeForgotPassword: async ({email, forgotToken}) => {
    try {
      //查詢 user，隨機更換user密碼
      let user;
      let passport;
      //再次寄送mail
      let {user, passport};
      return result;
    } catch (e) {
      throw e;
    }
  }
}
