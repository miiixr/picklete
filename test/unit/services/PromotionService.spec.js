describe("about Shop Discount", function() {
	before(async (done) => {
		try{
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
        discount: ''
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
