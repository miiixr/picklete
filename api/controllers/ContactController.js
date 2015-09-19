module.exports = {
  index: async function (req, res) {
    let company = await db.Company.findOne();
    res.view('main/contact', {
      company
    });
  }
};