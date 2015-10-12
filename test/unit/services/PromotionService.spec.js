
describe("about Shop Discount", function() {

  let createdProductGm1;
  let createdProducts = [];

	before(async (done) => {
		try{
      // create productGm
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

      // create products
      let productNames = [
        'promotion-creatre',
        'promotion-update',
        'promotion-delete'
      ];
      for (var i=0; i < productNames.length; i++) {
        var x = await db.Product.create({
          weight: [i],
          name: productNames[i],
          description: 'spec-test-' + i + '-' + productNames[i] ,
          stockQuantity: 1111,
          isPublish: true,
          price: 1399 + i,
          size: 'normal',
          service: ["express"],
          country: 'U.K',
          madeby: 'TW',
          color: 3,
          productNumber: '2-USA-3-G-' + i,
          spec: 'super-metal',
          photos: ["https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg",
            "https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-22.jpg"]
        });
        createdProducts.push(x);
      }

			done();
		} catch (e) {
      console.log(e.stack);
      done(e);
    }
	});

	after((done) => {
	  done();
  });

  let createPromotion;
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
        productIds: [ createdProducts[0].id ]
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

  it('Promotion updtae', async (done) => {
    try {
      var promotion = {
        id: '3',
        title: 'AAAAAA',
        type: 'general',
        startDate: '2015-10-08',
        endDate: '2015-10-07',
        discountType: 'discount',
        price: '0',
        discount: '95',
        description: 'BBBBBBB',
        productIds: [ createdProducts[1].id ]
      }
      let createPromotion = await PromotionService.update(promotion);
			createPromotion.title.should.be.equal("AAAAAA");
      createPromotion.description.should.be.equal("BBBBBBB");
      createPromotion.price.should.be.equal(0);
      createPromotion.type.should.be.equal('general');
      createPromotion.discountType.should.be.equal('discount');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
  // end create



  describe("about productPriceTransPromotionPrice", function() {

    let createdProductGm1, createdProductGm2;
    let createdProduct1, createdProduct2, createdProduct3;
    let createdPromotion1, createdPromotion2;
    let commonPrice = 1000;
    let date1 = new Date();
    let date2 = new Date(2017,1,2);

  	before(async (done) => {
      try{

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
        });
        await createdPromotion1.setProducts([createdProduct1, createdProduct2]);

        // create promotion 2
        createdPromotion2 = await db.Promotion.create({
          title : 'spec-promotion-service-pricing-2',
          description : 'this is a test promotion',
          startDate : new Date(2017, 1, 1),
          endDate : new Date(2017, 12, 30),
          type : 'general',
          discountType:'price',
          price: 300,
        });
        await createdPromotion2.setProducts([createdProduct3]);

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
        let findProducts = [createdProduct1, createdProduct2];

        // processing with productPriceTransPromotionPrice
        let discountedProducts = await PromotionService.productPriceTransPromotionPrice(date1, findProducts);

        // check status
        discountedProducts.should.be.Object;
        discountedProducts.forEach(product => {
          product.price.should.be.equal(commonPrice * createdPromotion1.discount);
          product.originPrice.should.be.equal(commonPrice);
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
        let findProducts = [createdProduct3];

        // processing with productPriceTransPromotionPrice
        let pricedProducts = await PromotionService.productPriceTransPromotionPrice(date2, findProducts);
        pricedProducts.should.be.Array;
        pricedProducts.forEach(product => {
          product.price.should.be.equal(commonPrice - createdPromotion2.price);
          product.originPrice.should.be.equal(commonPrice);
        });

        done();
      } catch (e) {
        console.log(e.stack);
        done(e);
      }
    });
    // end

  });


});
