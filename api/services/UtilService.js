import crypto from 'crypto';

module.exports = {

  generateHashCode: async () => {
    var token = await new Promise((resolve) =>
      crypto.randomBytes(20, (error, buf) => resolve(buf.toString("hex")))
    );
    return token;
  },

  errorHandle: async (req, res) => {
    console.log('=== errorHandle ===');

    try {
      let loginUser = UserService.getLoginUser(req);
      let redirectUrl = '';

      if(loginUser == undefined) {
        redirectUrl = '/shop/list';
      } else if(loginUser.Role.authority == 'admin'){
        redirectUrl = '/admin/goods';
      } else if(loginUser.Role.authority == 'user'){
        redirectUrl = '/shop/list';
      }else {
        redirectUrl = '/shop/list';
      }

      console.log('=== redirectUrl ===', redirectUrl);



      return res.redirect(redirectUrl);

    }
    catch(e) {
      console.error(e.stack);
    }
  }
}
