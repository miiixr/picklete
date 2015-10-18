import crypto from 'crypto';

module.exports = {

  generateHashCode: async () => {
    var token = await new Promise((resolve) =>
      crypto.randomBytes(20, (error, buf) => resolve(buf.toString("hex")))
    );
    return token;
  },

  // numberFormat(number, [ decimals=0, decimalSeparator='.', orderSeparator=',']) => string
  // http://epeli.github.io/underscore.string/#numberformat-number-decimals-0-decimalseparator-39-39-orderseparator-39-39-gt-string
  numberFormat: (number, dec, dsep, tsep) => {
    if (isNaN(number) || number == null) return '';

    number = number.toFixed(~~dec);
    tsep = typeof tsep == 'string' ? tsep : ',';

    let parts = number.split('.');
    let fnums = parts[0];
    let decimals = parts[1] ? (dsep || '.') + parts[1] : '';

    return '$ ' + fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
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
