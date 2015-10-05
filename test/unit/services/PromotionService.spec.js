
describe("about Shop Discount", function() {

  let createdProductGm1, createdProductGm2;

	before(async (done) => {
		try{
      // create 2 productGm
      createdProductGm1 = await db.ProductGm.create({
        brandId: 1,
        name: "spec-promotion-serivce-test-productGm-1",
        explain: "spec-promotion-serivce-test-productGm-1",
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });
      createdProductGm2 = await db.ProductGm.create({
        brandId: 1,
        name: "spec-promotion-serivce-test-productGm-2",
        explain: "spec-promotion-serivce-test-productGm-2",
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });

			done();
		} catch (e) {
      console.log(e.stack);
      done(e);
    }
	});

  // create
  it('Promotion create', async (done) => {
    try {
      var promotion = {
        title : 'spec-promotion-service-create',
        description : 'this is a test promotion',
        startDate : new Date(2014, 1, 1),
        endDate : new Date(2014, 12, 30),
        type : 'flash',
        discountType:'price',
        price: 2999,
        productGmIds: [ createdProductGm1.id, createdProductGm2.id ]
      }
      let createPromotion = await PromotionService.create(promotion);
			createPromotion.title.should.be.equal("spec-promotion-service-create");
      createPromotion.description.should.be.equal("this is a test promotion");
      createPromotion.price.should.be.equal(2999);
      createPromotion.type.should.be.equal('flash');
      createPromotion.discountType.should.be.equal('price');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
  // end create

  // delete
  it('Promotion delete', async (done) => {
    done();
  });
  // end delete
});


describe("about productPriceTransPromotionPrice", function() {

  let createdProductGm1, createdProductGm2;
  let createdProduct1, createdProduct2, createdProduct3;
  let createdPromotion1, createdPromotion2;
  let commonPrice = 1000;
  let date1 = new Date();
  let date2 = new Date(2017,1,2);

	before(async (done) => {
    try{
      // create productGms
      createdProductGm1 = await db.ProductGm.create({
        brandId: 1,
        name: "spec-promotion-serivce-test-productGm-3",
        explain: "spec-promotion-serivce-test-productGm-3",
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });
      createdProductGm2 = await db.ProductGm.create({
        brandId: 1,
        name: "spec-promotion-serivce-test-productGm-4",
        explain: "spec-promotion-serivce-test-productGm-4",
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });

      // create products
      createdProduct1 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-1',
        description: 'spec-test-product-1',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm1.id
      });
      createdProduct2 = await db.Product.create({
        color: '2',
        name: 'spec-test-product-2',
        description: 'spec-test-product-2',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm1.id
      });
      createdProduct3 = await db.Product.create({
        color: '3',
        name: 'spec-test-product-3',
        description: 'spec-test-product-3',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm2.id
      });

      // create promotion 1
      createdPromotion1 = await db.Promotion.create({
        title : 'spec-promotion-service-pricing-1',
        description : 'this is a test promotion',
        startDate : new Date(2015, 1, 1),
        endDate : new Date(2016, 12, 30),
        type : 'general',
        discountType:'discount',
        discount: 0.5,
        productGmIds: [ createdProductGm1.id, createdProductGm2.id ]
      });
      await createdPromotion1.setProductGms([createdProductGm1,createdProductGm2]);

      // create promotion 2
      createdPromotion2 = await db.Promotion.create({
        title : 'spec-promotion-service-pricing-2',
        description : 'this is a test promotion',
        startDate : new Date(2017, 1, 1),
        endDate : new Date(2017, 12, 30),
        type : 'general',
        discountType:'price',
        price: 300,
        productGmIds: [ createdProductGm1.id, createdProductGm2.id ]
      });
      await createdPromotion2.setProductGms([createdProductGm1,createdProductGm2]);

      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });

  // productPriceTransPromotionPrice - date1
  it('Set product price fron promotions - date 1', async (done) => {
    try {
      // find product by given ProductGmId
      let findProducts = await db.Product.findAll({
        where:{
          $or: [
            {ProductGmId: createdProductGm1.id},
            {ProductGmId: createdProductGm2.id}
          ]
        }
      });
      // package
      let products = {
        rows: findProducts
      };

      // processing with productPriceTransPromotionPrice
      let discountedProducts = await PromotionService.productPriceTransPromotionPrice(date1, products);

      // check status
      discountedProducts.should.be.Object;
      discountedProducts.rows.forEach(product => {
        product.price.should.be.equal(commonPrice * createdPromotion1.discount);
      });

      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });
  // end

  // productPriceTransPromotionPrice - date2
  it('Pricing: Set product price fron promotions', async (done) => {
    try {
      // find product by given ProductGmId
      let findProducts = await db.Product.findAll({
        where:{
          $or: [
            {ProductGmId: createdProductGm1.id},
            {ProductGmId: createdProductGm2.id}
          ]
        }
      });
      // package
      let products = {
        rows: findProducts
      };

      // processing with productPriceTransPromotionPrice
      let pricedProducts = await PromotionService.productPriceTransPromotionPrice(date2,products);
      pricedProducts.should.be.Object;
      pricedProducts.rows.forEach(product => {
        product.price.should.be.equal(commonPrice - createdPromotion2.price);
      });

      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });
  // end

});