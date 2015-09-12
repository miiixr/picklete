import moment from "moment";
import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  create: async (updateProduct) => {
    console.log('----------');
    console.log(updateProduct);
    console.log('----------');

    // 如果選擇其他品牌的話，找出其他品牌的 id
    var brandType = updateProduct.brandType;
    var brandName = updateProduct.customBrand;
    var brandId = updateProduct.brandId;

    if (brandType.toLowerCase() === 'custom') {
      brandId = await db.Brand.findOne({ where: {type: 'OTHER'} });
      brandId = brandId.dataValues.id;
    }

    var tag = updateProduct.tag || '';
    if (tag) {
      tag = tag.split(',');
    }

    let newProductGm = {
      brandId: brandId,
      name: updateProduct.name,
      brandName: brandName,
      explain: updateProduct.explain || "",
      usage: updateProduct.usage || "",
      notice: updateProduct.notice || "",
      tag: tag || [],
      coverPhoto: updateProduct['coverPhoto'] || []
    };
    let createdProductGm;
    // create product gm
    try {

      createdProductGm = await db.ProductGm.create(newProductGm);
      await createdProductGm.setDpts(updateProduct.dptId);
      await createdProductGm.setDptSubs(updateProduct.dptSubId);

      // if(updateProduct.dptSubId != undefined && updateProduct.dptSubId != '')
        

    } catch (e) {
      console.error(e);
      return;
    }

    if ( !createdProductGm )
      return;

    var goods = updateProduct.good;

    for (var i = 0 ; i < goods.length ; i++) {
      var good = goods[i];
      var productNumber = good.productNumber;
      
      if ( ! productNumber || productNumber.length < 1) {
        continue;
      }

      var photos = [];
      if (good['photos-1'])
        photos.push(good['photos-1']);

      if (good['photos-2'])
        photos.push(good['photos-2']);

      // product.photos = photos;

      let newProduct = {
        name: good.name || "",
        stockQuantity: good.stockQuantity || 0,
        isPublish: good.isPublish || false,
        price: updateProduct.price,
        size: updateProduct.size,
        comment: updateProduct.comment,
        service: updateProduct.service,
        country: updateProduct.country,
        madeby: updateProduct.madeby,
        spec: updateProduct.spec,
        color: good.color || 1,
        productNumber: productNumber,
        photos: photos,
        ProductGmId: createdProductGm.id,
      };

      try {
        await db.Product.create(newProduct);
      } catch (e) {
        return console.error(e)
      }
    }

  },

  update: async (updateProduct) => {

    console.log('=== updateProduct ===', updateProduct);

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

      var goods = updateProduct.good;
      for (var i = 0 ; i < goods.length ; i++) {

        var good = goods[i];

        let product = await db.Product.find({
          where: {
            id: good.id
          }
        });

        product.name = good.description;
        product.price = updateProduct.price;
        product.size = updateProduct.size;
        product.comment = updateProduct.comment;
        product.service = updateProduct.service;
        product.country = updateProduct.country;
        product.madeby = updateProduct.madeby;
        product.spec = updateProduct.spec;
        product.color = good.color;
        product.productNumber = good.productNumber;
        product.stockQuantity = good.stockQuantity;
        product.description = good.description;
        product.isPublish = (good.isPublish == "false") ? false : true;


        let photos = [];


        if (good['photos-1'])
          photos.push(good['photos-1']);

        if (good['photos-2'])
          photos.push(good['photos-2']);

        product.photos = photos;

        await product.save();

      }



      productGm.brandId = brand.id;
      productGm.name = updateProduct.name;
      productGm.dptId = updateProduct.dptId;
      productGm.dptSubId = updateProduct.dptSubId;
      productGm.explain = updateProduct.explain;
      productGm.usage = updateProduct.usage;
      productGm.notice = updateProduct.notice;
      productGm.tag = updateProduct.tag;
      productGm.coverPhoto = updateProduct.coverPhoto;
      

      await productGm.save();

      if(updateProduct.dptId != null)
        await productGm.setDpts(updateProduct.dptId);

      if(updateProduct.dptSubId != '')
        await productGm.setDptSubs(updateProduct.dptSubId);


    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  },

  findGmWithImages: async (productGmId) => {
    let productGm = await db.ProductGm.find({
      where: {id: productGmId},
      include: [
        {model: db.Product},
        {model: db.Dpt}, 
        {model: db.DptSub}
      ]
    });

    // console.log(productGm.products);
    return productGm;
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
