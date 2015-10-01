describe("about Shop Discount", function() {
  let createdProductGm,createdProductGm2;
	before(async (done) => {
		try{
      createdProductGm = await db.ProductGm.create({
        brandId: 1,
        name: "好東西商品",
        explain: '好東西就是要買，買買買',
        usage: '請安心服用',
        notice: '18 歲以下請勿使用',
        depId: 1,
        depSubId: 1,
        coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
      });

      createdProductGm2 = await db.ProductGm.create({
        brandId: 1,
        name: "好東西商品2",
        explain: '好東西就是要買，買買買',
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

	after((done) => {
	  done();
  });

  it('Promotion create', async (done) => {
    try {
      var promotion = {
        title : 'best price!',
        description : 'this is a test promotion',
        startDate : new Date(2015, 9, 8),
        endDate : new Date(2015, 9, 20),
        price : 2999.97,
        type : 'flash',
        discountType:'discount',
        discount: '',
        productGmIds: [ createdProductGm.id, createdProductGm2.id]
      }
      let createPromotion = await PromotionService.create(promotion);
			createPromotion.title.should.be.equal("best price!");
      createPromotion.description.should.be.equal("this is a test promotion");
      createPromotion.price.should.be.equal(2999.97);
      createPromotion.type.should.be.equal('flash');
      createPromotion.discountType.should.be.equal('discount');
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
});
