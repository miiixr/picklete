describe("about FAQ" , () => {
	let testFAQ = null;

	before(async (done) => {
		
		let newFAQType = {
			name: "測試類別"
		};
		testFAQ = await db.FAQType.create(newFAQType);
		
		let newFAQ = {
			title: "我該怎測試",
			answer: "這樣做測試",
			FAQTypeId: testFAQ.id
		};
		testFAQ = await db.FAQ.create(newFAQ);

		done();
	});

	it('', (done) =>{
		request(sails.hooks.http.app)
		.get(`/FAQ`)
		.end((err , res) => {
			if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.FAQ.should.be.Object;
      res.body.FAQType.should.be.Object;
      res.body.FAQ.title.should.be.String;
      res.body.FAQType.name.should.be.String;

      done(err);
		});
	});



  after((done) => {
	  // end this simulated login
	  UserService.getLoginState.restore();
	  done();
  });





});