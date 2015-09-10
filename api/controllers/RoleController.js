/* RoleController */
module.exports = {
  debug: async (req, res) => {
    try {
      res.ok(await db.Role.findAndCountAll());
    }
    catch (error) {
      return res.serverError(error);
    }
  }
};
