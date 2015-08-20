module.exports = {
  generateOrderSerialNumber: async () => {
    let today = new Date();
    let dateString = OrderServive._dateFormat(today);


    let todayOrderConut = await db.Order.findOne({
      where: {
        createdAt: 'between today'
      }
    })

    let todayOrderConutString = Format(todayOrderConut);

    return `${dateString}${todayOrderConutString}`;

  },

  _dateFormat: (nowDate) => {
    var dd, mm, yyyy;
    yyyy = nowDate.getFullYear().toString();
    mm = (nowDate.getMonth() + 1).toString();
    dd = nowDate.getDate().toString();
    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
  }
}
