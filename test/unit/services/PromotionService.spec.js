
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
        startDate : new Date(2015, 1, 1),
        endDate : new Date(2016, 12, 30),
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
      createPromotion.productGmIds.length.should.be.equal(2);
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

  let createdProductGm1;
  let createdProduct1, createdProduct2;
  let createdPromotion;
  let commonPrice = 1000;

	before(async (done) => {
    try{
      // create a productGm
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

      // create 2 products
      createdProduct1 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-1',
        description: 'spec-test-product-1',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm.id
      });
      createdProduct2 = await db.Product.create({
        color: '2',
        name: 'spec-test-product-2',
        description: 'spec-test-product-2',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm.id
      });

      // create a test promotion
      createdPromotion = await db.Promotion.create({
        title : 'spec-promotion-service-pricing',
        description : 'this is a test promotion',
        startDate : new Date(2015, 1, 1),
        endDate : new Date(2016, 12, 30),
        type : 'general',
        discountType:'discount',
        discount: 0.5,
        productGmIds: [ createdProductGm1.id ]
      });
      await createdPromotion.setProductGms([createdProductGm1]);
      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });

  // productPriceTransPromotionPrice
  it('Pricing: Set product price fron promotions', async (done) => {
    try {
      // find product by given ProductGmId
      let findProducts = await db.Product.findAll({
        where:{
          ProductGmId: createdProductGm1.id
        }
      });
      console.log('=== raw findProducts[0] ==>\n',findProducts[0].toJSON());

      // processing with productPriceTransPromotionPrice
      let pricedProducts = await PromotionService.productPriceTransPromotionPrice(findProducts);
      console.log('=== pricedProducts[0] ==>\n',pricedProducts[0].toJSON());

      // check status
      pricedProducts.should.be.Object;
      pricedProducts.forEach(product => {
        console.log('=== product.id ==>',product.id);
        console.log('=== product.price ==>',product.price);
        product.price.should.be.equal(commonPrice*createdPromotion.discount);
      });

      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });
  // end productPriceTransPromotionPrice
});
