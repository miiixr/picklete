import moment from 'moment';

describe("about product service", () => {
  let createdProduct, createdProduct2, createdProductGm;
  let productGmA, productGmB, dptA, dptB, dptSubA, dptSubB ,dptC, dptSubC, dptD, dptSubD;
  before(async (done) => {

    try {

      dptA = await db.Dpt.create({
        name: 'test 大館 A',
        weight: 999,
        official: true,
      });

      dptB = await db.Dpt.create({
        name: 'test 大館 B',
        weight: 999,
        official: true,
      });

      dptC = await db.Dpt.create({
        name: 'test 大館 C',
        weight: 999,
        official: true,
      });

      dptD = await db.Dpt.create({
        name: 'test 大館 D',
        weight: 999,
        official: true,
      });

      dptSubA = await db.DptSub.create({
        name: 'test 小館 A',
        weight: 100,
        official: false
      })

      dptSubB = await db.DptSub.create({
        name: 'test 小館 B',
        weight: 100,
        official: false
      })

      dptSubC = await db.DptSub.create({
        name: 'test 小館 C',
        weight: 100,
        official: false
      })

      dptSubD = await db.DptSub.create({
        name: 'test 小館 D',
        weight: 100,
        official: false
      })

      await dptA.setDptSubs(dptSubA);
      await dptB.setDptSubs(dptSubB);
      await dptC.setDptSubs(dptSubC);
      await dptD.setDptSubs(dptSubD);

      createdProductGm = await db.ProductGm.create({
        brandId: 1,
        explain: 'req.body.explain',
        usage: 'req.body.usage',
        notice: 'req.body.notice',
        depId: dptA.id,
        depSubId: dptSubA.id
      });

      await createdProductGm.setDpts([dptA]);
      await createdProductGm.setDptSubs([dptSubA]);


      createdProduct = await db.Product.create({
        color: '1',
        description: '11',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });

      createdProduct2 = await db.Product.create({
        color: '2',
        description: '22',
        productNumber: '22',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });

      // build test data for productQuery spec

      let createdQueryProductGmA = await db.ProductGm.create({
        brandId: 2,
        name: "ProductGmNameGroupA",
        depId: dptC.id,
        depSubId: dptSubC.id,
        tag: ['咖啡','手機','杯子']
      });

      let createdQueryProductGmB = await db.ProductGm.create({
        brandId: 3,
        name: "ProductGmNameGroupB",
        depId: dptC.id,
        depSubId: dptSubC.id,
        tag: ['電腦','遊戲','手機']
      });

      await createdQueryProductGmA.setDpts([dptC]);
      await createdQueryProductGmA.setDptSubs([dptSubC]);
      await createdQueryProductGmB.setDpts([dptD]);
      await createdQueryProductGmB.setDptSubs([dptSubD]);

      let createdQueryProducts = await db.Product.bulkCreate([{
        name: '',
        stockQuantity: 100,
        isPublish: 'true',
        price: 777,
        productNumber: 'QueryA',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
        ProductGmId: createdQueryProductGmA.id
      },{
        name: 'A1234',
        stockQuantity: 500,
        isPublish: 'true',
        price: 557237,
        productNumber: 'QueryA',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
        ProductGmId: createdQueryProductGmA.id
      },{
        name: 'A1235',
        stockQuantity: 400,
        isPublish: 'true',
        price: 557237,
        productNumber: 'QueryA',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
        ProductGmId: createdQueryProductGmA.id
      },{
        name: 'B1235',
        stockQuantity: 600,
        isPublish: 'true',
        price: 557237,
        productNumber: 'QueryB',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
        ProductGmId: createdQueryProductGmB.id
      },{
        name: 'B1235',
        stockQuantity: 900,
        isPublish: 'true',
        price: 557237,
        productNumber: 'QueryB',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
        ProductGmId: createdQueryProductGmB.id
      }]);

      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }

  });
  it("product create", async (done) => {
    let newProduct = {
      brandType: 'origin',
      brandId: '1',
      customBrand: '',
      dptId: [ '2', '1' ],
      dptSubId: [ '4', '2' ],
      name: '423423',
      price: '432',
      country: '432',
      madeby: '432',
      spec: '432',
      size: '432',
      service: [ 'express', 'store', 'package' ],
      comment: '432432',
      good:
       [ { 'photos-1': '',
           'photos-2': '',
           color: '3',
           description: '432',
           productNumber: '423432',
           stockQuantity: '999',
           isPublish: 'false' },
         { 'photos-1': '',
           'photos-2': '',
           color: '5',
           description: '432423',
           productNumber: '432432',
           stockQuantity: '999',
           isPublish: 'false' },
         { 'photos-1': '',
           'photos-2': '',
           color: '12',
           description: '432',
           productNumber: '432432',
           stockQuantity: '999',
           isPublish: 'false' } ],
      coverPhoto: [ '' ],
      explain: '<p>432432432432432</p>\r\n',
      notice: '<p>423423423432423</p>\r\n',
      tag: ',學生,寵物,旅行'
    };

    try {
      let product = await ProductService.create(newProduct);
      // console.log(product);
      done();
    } catch (e) {
      return done(e);
    }

  });

  it('product update', async (done) => {

    try {
      let updateProduct = {
        brandType: 'origin',
        brandId: '2',
        customBrand: 'OTHER',
        dptId: [ dptB.id ],
        dptSubId: [ dptSubB.id ],
        name: '111',
        price: '11',
        country: '11',
        madeby: '11',
        spec: '11',
        size: '11',
        service: [ 'express', 'store', 'package' ],
        comment: '11',
        good:
         [ { color: '1',
             name: '1111111',
             description: '1111111',
             productNumber: '1111111',
             stockQuantity: '999',
             isPublish: 'false',
             weight: 0,
             id:createdProduct.id },
            { color: '2',
             name: '1111111',
             description: '22222',
             productNumber: '2222',
             stockQuantity: '999',
             isPublish: 'true',
             weight: 1,
             id:createdProduct2.id } ],
        productGm: {
          id: createdProductGm.id
        },
        explain: '',
        notice: '',
        tag: '咖啡,午茶'
      };

      await ProductService.update(updateProduct);

      let updatedProduct = await db.Product.find({
        where: {
          id: createdProduct.id
        },
        include: [{
          model: db.ProductGm,
          include: [
            db.Dpt,
            db.DptSub
          ]
        }]
      });

      updatedProduct.ProductGm.Dpts[0].id.should.be.equal(dptB.id);
      updatedProduct.ProductGm.DptSubs[0].id.should.be.equal(dptSubB.id)

      done();
    } catch (e) {
      done(e);
    }

  });

  it('product call gm', async (done) => {
    try {
      let productGm = await ProductService.findGmWithImages(createdProductGm.id);
      console.log(productGm.Products);
      productGm.Products.length.should.above(1);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('find Favorite list', async (done) => {
    try {
      let product = await ProductService.findFavorite({
        11: true,
        5: true,
        6: true
      });
      console.log(product);
      product.should.be.an.Object;
      done();
    } catch (e) {
      done(e);
    }
  });

  it('find NOT Favorite list', async (done) => {
    try {
      let product = await ProductService.findFavorite({});
      console.log(product);
      product.should.be.an.Array;
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by name', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.name = 'GroupA';
      queryResults = await ProductService.productQuery(queryObj);
      console.log(queryResults);
      queryResults.count.should.be.above(0);
      for (let product of queryResults.rows) {
        let name = product['ProductGm']['name'];
        name.should.be.include(queryObj.name);
      }
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by productNumber', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.productNumber = 'QueryA';
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      for (let product of queryResults) {
        product['productNumber'].should.be.equal(queryObj.productNumber);
      }
      // queryResults.should.have.length(3);

      queryObj.productNumber = 'QueryB';
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      for (let product of queryResults) {
        product['productNumber'].should.be.equal(queryObj.productNumber);
      }
      // queryResults.should.have.length(2);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by dptId', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.dptId = dptC.id;
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      for (let product of queryResults) {
        let GmData = await db.ProductGm.findOne({where:{id: product.ProductGmId}, include: [db.Dpt] });
        let GmDptDatas = GmData.Dpts;
        let dptIds = [];

        for (let gmDptData of GmDptDatas) {
          let dptId = gmDptData.id;
          dptIds.push(dptId);
        }
        dptIds.should.be.include(queryObj.dptId);
      }
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by dptId & dptSubId', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.dptId = dptC.id;
      queryObj.dptSubId = dptSubC.id;
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      await* queryResults.map( async (product) => {
        let GmData = await db.ProductGm.findOne({where:{id: product.ProductGmId}, include: [db.DptSub] });
        let GmDptDatas = GmData.DptSubs;
        let dptIds = [],
            dptSubIds = [];

        for (let gmDptData of GmDptDatas) {
          let dptId = gmDptData.DptId;
          let dptSubId = gmDptData.id;
          dptIds.push(dptId);
          dptSubIds.push(dptSubId);
        }

        dptIds.should.be.include(queryObj.dptId);
        dptSubIds.should.be.include(queryObj.dptSubId);
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by price', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.price = 557237;
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      // queryResults.should.have.length(4);
      for (let product of queryResults) {
        product['price'].should.be.equal(queryObj.price);
      }
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by tags', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.tag = '手';
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      // queryResults.should.have.length(5);

      for (let product of queryResults) {
        let result = await db.ProductGm.findById(product.ProductGmId);
        let tagStr = '';
        for (let str of result.tag) {
          tagStr += str;
        }
        tagStr.should.be.include(queryObj.tag);
      }

      queryObj.tag = '遊戲';
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;

      for (let product of queryResults) {
        let result = await db.ProductGm.findById(product.ProductGmId);
        let tagStr = '';
        for (let str of result.tag) {
          tagStr += str;
        }
        tagStr.should.be.include(queryObj.tag);
      }
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query by stockQuantity', async (done) => {
    try{
      let queryObj = {}, queryResults;
      queryObj.stockQuantityStart = 400;
      queryObj.stockQuantityEnd = 800;
      queryResults = await ProductService.productQuery(queryObj);
      queryResults = queryResults.rows;
      // queryResults.should.have.length(3);
      await queryResults.map( async (product) => {
        product['stockQuantity'].should.be.within( queryObj.stockQuantityStart, queryObj.stockQuantityEnd);
      });
      done();
    } catch (e) {
      done(e);
    }
  });


});
