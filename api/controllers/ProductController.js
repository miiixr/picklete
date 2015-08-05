let ProductController = {
  findOne: async (req, res) => {
    try {
      let productId = req.param("productId");
      let product = await ProductService.findWithImages(productId);
      return res.ok({product});
    } catch (error) {
      return res.serverError(error);
    }
  },

  find: async (req, res) => {

    try {
      let products = await ProductService.findAllWithImages();
      return res.ok({products});
    } catch (error) {
      return res.serverError(error);
    }

  }
};

module.exports = ProductController;
