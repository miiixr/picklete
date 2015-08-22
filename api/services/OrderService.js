import moment from 'moment';
let sprintf = require("sprintf-js").sprintf;

module.exports = {
  generateOrderSerialNumber: async (orderDate) => {
    let dateString = OrderService._dateFormat(orderDate);
    let startDate = moment().startOf('day').toDate();
    let endDate = moment().startOf('day').add(1, 'days').add(-1, 'seconds').toDate();

    console.log(startDate);
    console.log(endDate);

    let todayOrderConut = await db.Order.count({
      where: {
        createdAt: {
          between: [startDate, endDate]
        }
      }
    })



    let todayOrderConutString = sprintf("%03d", todayOrderConut);

    return `${dateString}${todayOrderConutString}`;

  },

  _dateFormat: (nowDate) => {
    let years = parseInt(nowDate.format('YY'));
    let month = parseInt(nowDate.format('MM'));
    let day = parseInt(nowDate.format('DD'));
    console.log('=== dateString ===', `${years} ${month} ${day}`);

    let alphabet = [
      '0','1','2','3','4',
      '5','6','7','8','9',
      'a','b','c','d','e',
      'f','g','h','i','j',
      'k','l','m','n','o',
      'p','q','r','s','t',
      'u','v','w','x','y',
      'z'];

    let result = `${years}${alphabet[month]}${alphabet[day]}`;

    return result;



  }
}
