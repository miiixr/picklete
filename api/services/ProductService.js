import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  createProduct: async (req) => {
    var brandType = req.body.brandType;
    var brand;
    if (brandType.toLowerCase() === 'other') {
      brand = await db.Brand.findOne({ where: {type: 'OTHER'} });
    } else {
      brand = req.body.brandId;
    }

    var tag = req.body.tag || '';
    if (tag) {
      tag = tag.split(',');
    }

    let newProductGm = {
      brandId: brand,
      dptId: parseInt(req.body.dptId, 10),
      dptSubId: parseInt(req.body.dptSubId, 10),
      explain: req.body.explain,
      usage: req.body.usage,
      notice: req.body.notice,
      tag: tag,
      coverPhoto: []
    };
    // create product gm
    let createdProductGm = await db.ProductGm.create(newProductGm);

    let newProduct = {
      name: req.body.name,
      description: req.body['good[0][description]'],
      stockQuantity: req.body['good[0][stockQuantity]'],
      isPublish: req.body['good[0][isPublish]'],
      price: req.body.price,
      size: req.body.size,
      comment: req.body.comment,
      service: req.body.service,
      country: req.body.country,
      madeby: req.body.madeby,
      color: req.body['good[0][color]'],
      productNumber: req.body['good[0][productNumber]'],
      photos: [],
      ProductGmId: createdProductGm.id,
    };

    await db.Product.create(newProduct);

  },

  findWithImages: async (productId) => {
    let product = await db.Product.findById(productId);
    let productWithImage = ProductService.withImage(product);
    return productWithImage;
  },

  findAllWithImages: async () => {
    let products = await db.Product.findAll();
    let productsWithImage = products.map(ProductService.withImage);
    return productsWithImage;
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
