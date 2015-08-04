let ProductController = {
  findOne: async (req, res) => {
    let productId = req.param("productId");
    let product = await ProductService.findWithImages(productId);
    return res.ok({product});
  },

  find: async (req, res) => {

    let productId = req.param("productId");

    let src = __dirname + '/../../assets/images/product/1.jpg';
    let data = fs.readFileSync(src).toString("base64");
    let base64data = util.format("data:%s;base64,%s", mime.lookup(src), data);
    let product = await db.Product.findOne({
      where: {id: productId}
    });

    let productJson = product.toJSON();
    productJson.image = base64data;

    return res.ok({
      product: product
    });
  }
};

module.exports = ProductController;
