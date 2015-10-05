
module.exports = {
  checkCode : async (code) => {
    try {
      return result;
    } catch (e) {
      let msg = e.message;
      throw new Error (msg);
    }
  },

  use: async (data) => {
    let result;
    try {
      return result;
    } catch (e) {
      let msg = e.message;
      result = data;
      throw new Error ({ msg , result);
    }
  }
}
