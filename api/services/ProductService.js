import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {
  findWithImages: async (productId) => {
    let product = await db.Product.findById(productId);
    let productWithImage = ProductService.withImage(product);
    return productWithImage;
  },

  findAllWithImages: async () => {
    let products = await db.product.findAll();
    let productsWithImage = products.map(this.withImage);
    return productsWithImages;
  },

  withImage: (product) => {
    let productJson = product.toJSON();

    try {
      let src = `${__dirname}/../../assets/images/product/${product.id}.jpg`;
      let data = fs.readFileSync(src).toString("base64");

      if (data) {
        let base64data = util.format("data:%s;base64,%s", mime.lookup(src), data);
        productJson.image = base64data;
      }
    } catch (error) {
      console.log(`can\'t find product ${product.id} image`);
      productJson.image = 'about:blank';
    }

    return productJson;
  }
};
