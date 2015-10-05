
module.exports = {
  checkCode : async (code) => {
    try {
      return false;
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  },

  use: async (data) => {
    try {
      return false;
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      let success = false;
      return res.serverError({message, success});
    }
  }
}
