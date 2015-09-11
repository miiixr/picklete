import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  createProduct: async (req) => {
    console.log('----------');
    console.log(req.body);
    console.log('----------');

    // 如果選擇其他品牌的話，找出其他品牌的 id 
    var brandType = req.body.brandType;
    var brandName = req.body.customBrand;
    var brandId = req.body.brandId;
    if (brandType.toLowerCase() === 'custom') {
      brandId = await db.Brand.findOne({ where: {type: 'OTHER'} });
      brandId = brandId.dataValues.id;
    }


    var tag = req.body.tag || '';
    if (tag) {
      tag = tag.split(',');
    }

    let newProductGm = {
      brandId: brandId,
      brandName: brandName, 
      dptId: req.body['dptId'],
      dptSubId: req.body['dptSubId'],
      explain: req.body.explain || "",
      usage: req.body.usage || "",
      notice: req.body.notice || "",
      tag: tag || [],
      coverPhoto: req.body['coverPhoto'] || []
    };
    // create product gm
    let createdProductGm = await db.ProductGm.create(newProductGm);

    if ( !createdProductGm )
      return;

    var goods = req.body['good[description]'];
    console.log(goods);

    if (typeof goods != 'object') {
      
      var name = goods || '';
      var stockQuantity = req.body['good[stockQuantity]'] || '';
      var isPublish = req.body['good[isPublish]'] || '';
      var productNumber = req.body['good[productNumber]'] || '';
      var photos = [ req.body['good[photos-1]'], req.body['good[photos-2]'] ] || [];
      var color = req.body['good[color]'] || '';
      
      let newProduct = {
        name: String(name),
        stockQuantity: stockQuantity,
        isPublish: isPublish,
        price: req.body.price,
        size: req.body.size,
        comment: req.body.comment,
        service: req.body.service,
        country: req.body.country,
        madeby: req.body.madeby,
        color: color,
        productNumber: productNumber,
        photos: photos || [],
        ProductGmId: createdProductGm.id,
      };

      await db.Product.create(newProduct);
      return;
    }

    for (var i = 0 ; i < goods.length ; i++) {
      var name = goods[i] || '';
      if ( ! name || name.length < 1) {
        continue;
      }

      var photos = [];
      var photos1 = req.body['good[photos-1]'];
      if (photos1 && photos1[i])
        photos.push(photos1[i]);

      var photos2 = req.body['good[photos-2]'];
      if (photos2 && photos2[i])
        photos.push(photos2[i]);

      let newProduct = {
        name: String(name),
        stockQuantity: req.body['good[stockQuantity]'][i] || stockQuantity,
        isPublish: req.body['good[isPublish]'][i] || isPublish,
        price: req.body.price,
        size: req.body.size,
        comment: req.body.comment,
        service: req.body.service,
        country: req.body.country,
        madeby: req.body.madeby,
        color: req.body['good[color]'][i] || color,
        productNumber: req.body['good[productNumber]'][i] || productNumber,
        photos: photos,
        ProductGmId: createdProductGm.id,
      };

      try {
        await db.Product.create(newProduct);
      } catch (e) {
        console.error(e)
      }
    }

  },

  update: async (updateProduct) => {

    try {
      var {brandType} = updateProduct;
      var brand;
      if (brandType.toLowerCase() === 'other') {
        brand = await db.Brand.findOne({ where: {type: 'OTHER'} });
      } else {
        brand = {id: updateProduct.brandId};
      }

      var tag = updateProduct.tag || '';
      if (tag) {
        tag = tag.split(',');
      }

      console.log('updateProduct.productGm.id', updateProduct.productGm.id);
      let productGm = await db.ProductGm.find({
        where: {
          id: updateProduct.productGm.id
        }
      });

      let product = await db.Product.find({
        where: {
          id: updateProduct.good[0].id
        }
      });

      product.name = updateProduct.name;
      product.price = updateProduct.price;
      product.size = updateProduct.size;
      product.comment = updateProduct.comment;
      product.service = updateProduct.service;
      product.country = updateProduct.country;
      product.madeby = updateProduct.madeby;
      product.color = updateProduct.good[0].color;
      product.productNumber = updateProduct.good[0].productNumber;
      product.stockQuantity = updateProduct.good[0].stockQuantity;
      product.description = updateProduct.good[0].description;
      product.isPublish = updateProduct.good[0].isPublish;

      product.photos = [];
      if (updateProduct.good[0]['photos-1'])
        product.photos.push(updateProduct.good[0]['photos-1']);
      if (updateProduct.good[0]['photos-2'])
        product.photos.push(updateProduct.good[0]['photos-2']);

      await product.save();


      productGm.brandId = brand.id;
      productGm.dptId = updateProduct.dptId;
      productGm.dptSubId = updateProduct.dptSubId;
      productGm.explain = updateProduct.explain;
      productGm.usage = updateProduct.usage;
      productGm.notice = updateProduct.notice;
      product.coverPhoto = updateProduct.coverPhoto;

      await productGm.save();

      await productGm.setDpts(updateProduct.dptId);
      await productGm.setDptSubs(updateProduct.dptSubId);


    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  },

  findWithImages: async (productId) => {
    let product = await db.Product.find({
      where: {id: productId},
      include: [{
        model: db.ProductGm,
        include: [
          db.Dpt, db.DptSub
        ]
      }]
    });
    console.log('product', product);

    let productWithImage = ProductService.withImage(product);
    console.log(product);
    //console.log('productWithImage', productWithImage);
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
  },

  productQuery: async (req) => {
    let query = req.query,
        queryObj = {},
        queryGmObj = {};

    if(Object.keys(query).length > 0){
      // search condition
      if (query.price) {
        queryObj.price = query.price;
      }
      if (query.name) {
        queryObj.name = {
          $like: `%${query.name}%`
        };
      }
      if (query.productNumber) {
        queryObj.productNumber = query.productNumber;
      }
      // 存貨數量搜尋條件
      if (query.stockQuantityStart && query.stockQuantityEnd) {
        queryObj.stockQuantity = {
          $between: [query.stockQuantityStart, query.stockQuantityEnd]
        };
      } else if (query.stockQuantityStart || query.stockQuantityEnd) {
        queryObj.stockQuantity = query.stockQuantityStart ? {
          $gte: query.stockQuantityStart
        } : {
          $lte: query.stockQuantityEnd
        };
      }
      // 日期搜尋條件
      if (query.dateFrom && query.dateEnd) {
        queryObj.createdAt = {
          $between: [new Date(query.dateFrom), new Date(query.dateEnd)]
        };
      } else if (query.dateFrom || query.dateEnd) {
        queryObj.createdAt = query.dateFrom ? {
          $gte: new Date(query.dateFrom)
        } : {
          $lte: new Date(query.dateEnd)
        };
      }

      // 販售狀態 1:隱藏, 2:上架
      if (query.isPublish != '') {
        queryObj.isPublish = (query.isPublish == 'false') ? null : true;
      }



      // productGm 搜尋

      if (query.brandId > 0)
        queryGmObj.brandId = query.brandId;
      if (query.dptId > 0)
        queryGmObj.dptId = query.dptId;
      if (query.dptSubId > 0)
        queryGmObj.dptSubId = query.dptSubId;
      // tag keyword search
      if (query.keyword) {
        queryGmObj.tag = {
          $like: '%' + query.keyword + '%'
        };
      }
    }
    // execute query
    queryObj = {
      where: queryObj,
      include: [db.ProductGm]
    };
    let products = await db.Product.findAll(queryObj);

    queryGmObj = {
      where: queryGmObj,
      include: [db.Product]
    };
    let productGms = await db.ProductGm.findAll(queryGmObj);

    // 將productGm 搜尋結果的id取出
    let gmResultId = [];
    for (let productGm of productGms) {
      for (let gmProduct of productGm.Products) {
        gmResultId.push(gmProduct.id);
      }
    }
    // productGm 搜尋結果 與 product 搜尋結果 mapping
    let resultArray = [];
    for (let product of products) {
      if (gmResultId.indexOf(product.id) != -1) {
        resultArray.push(product);
      }
    }
    products = resultArray;

    // format datetime
    products = products.map(ProductService.withImage);
    for (let product of products) {
      product.createdAt = moment(product.createdAt).format("YYYY-MM-DD");
    }
    return products;
  }
};
