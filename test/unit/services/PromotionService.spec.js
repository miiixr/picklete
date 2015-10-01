describe("about Shop Discount", function() {
  let createdProductGm1,createdProductGm2,createdProductGm3;
  let createdProduct1,createdProduct2,createdProduct3,createdProduct4;
  let commonPrice = 1000;
	before(async (done) => {
		try{
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

      createdProductGm3 = await db.ProductGm.create({
        brandId: 1,
        name: "spec-promotion-serivce-test-productGm-3",
        explain: "spec-promotion-serivce-test-productGm-3",
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });

      createdProduct1 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-1',
        description: 'spec-test-product-1',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: 1000,
        ProductGmId: createdProductGm1.id
      });

      createdProduct2 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-2',
        description: 'spec-test-product-2',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm2.id
      });

      createdProduct3 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-3',
        description: 'spec-test-product-3',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: 1000,
        ProductGmId: createdProductGm3.id
      });

      createdProduct4 = await db.Product.create({
        color: '1',
        name: 'spec-test-product-4',
        description: 'spec-test-product-4',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'true',
        price: commonPrice,
        ProductGmId: createdProductGm2.id
      });

			done();
		} catch (e) {
      console.log(e.stack);
      done(e);
    }
	});

	after((done) => {
	  done();
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
        productGmIds: [ createdProductGm1.id ]
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
  it('Delete: delete a promotion', async (done) => {
    done();
  });
  // end delete

  // pricing
  it('Pricing: Set product price fron promotions', async (done) => {
    try {
      // create a test promotion
      var promotion = {
        title : 'spec-promotion-service-pricing',
        description : 'this is a test promotion',
        startDate : new Date(2015, 1, 1),
        endDate : new Date(2016, 12, 30),
        type : 'general',
        discountType:'discount',
        discount: 0.5,
        productGmIds: [ createdProductGm2.id ]
      }
      let createdPromotion = await db.Promotion.create(promotion);
      await createdPromotion.setProductGms([createdProductGm2]);

      // set price from setting of promotion
      let setPrice = await PromotionService.pricing(createdPromotion);

      // find product by given ProductGmId
      let findProducts = await db.Product.findAll({
        where:{
          ProductGmId: createdProductGm2.id
        }
      });
      console.log('=== findProducts[0] ==>\n',findProducts[0].toJSON());

      // check status
      findProducts.should.be.Object;
      findProducts.forEach(product => {
        console.log('=== product.id ==>',product.id);
        console.log('=== product.price ==>',product.price);
        product.price.should.be.equal(commonPrice*promotion.discount);
      });

      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
  // end pricing

});
