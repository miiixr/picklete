var sinon = require('sinon');

describe("about FAQ" , () => {
	let testFAQ = null;
	let testFAQType =null;
	let allFAQType = null;

	before(async (done) => {

		try {
			sinon.stub(UserService, 'getLoginState', (req) => {
				return true;
			});

			let newFAQType = {
				name: "測試類別"
			};
			testFAQType = await db.FAQType.create(newFAQType);

			let newFAQ = {
				title: "我該怎測試",
				answer: "這樣做測試",
				FAQTypeId: testFAQType.id
			};
			testFAQ = await db.FAQ.create(newFAQ);

			allFAQType = await db.FAQType.findAll();
			done();

		} catch (e) {
			done(e);
		}
	});

	after((done) => {
	  // end this simulated login
	  UserService.getLoginState.restore();
	  done();
  });

  it('show FAQ',(done) =>{
  	request(sails.hooks.http.app)
  		.get('/FAQ')
  		.end((err,res) => {
  			res.statusCode.should.equal(200);
  			return done();
  		});
	});

  it('show FAQ backboard',(done) =>{
  	request(sails.hooks.http.app)
  		.get('/admin/FAQ')
  		.end((err,res) => {
  			res.statusCode.should.equal(200);
  			return done();
  		});
	});

  it('show FAQTypeUpdate backboard',(done) =>{
  	request(sails.hooks.http.app)
  		.get('/admin/FAQUpdate')
  		.end((err,res) => {
  			res.statusCode.should.equal(200);
  			return done();
  		});
	});

	it('FAQ Add', (done) =>{
		request(sails.hooks.http.app)
			.post('/admin/FAQAdd')
			.send({
				title : "TEST",
				answer : "TEST",
				FAQTypeId : testFAQType.id
			})
			.end((err , res) => {
				res.statusCode.should.equal(302);
				res.headers.location.should.be.equal('/admin/FAQ');
    	  return done();
			});
	});

	it('FAQ Update', (done) =>{
		request(sails.hooks.http.app)
			.post('/admin/FAQUpdate?FAQId='+testFAQ.id)
			.send({
				title : "2",
				answer : "TEST2",
				FAQTypeId : testFAQType.id
			})
			.end((err , res) => {
				res.statusCode.should.equal(302);
				res.headers.location.should.be.equal('/admin/FAQ');
    	  return done();
			});
	});

	it('FAQ Delete', (done) =>{
		request(sails.hooks.http.app)
			.post('/admin/FAQUpdate?FAQId=1')
			.send({
				id : testFAQ.id
			})
			.end((err , res) => {
				res.statusCode.should.equal(302);
				res.headers.location.should.be.equal('/admin/FAQ');
    	  return done();
			});
	});

	it('FAQType Delete', (done) =>{
		request(sails.hooks.http.app)
			.post('/admin/FAQTypeDelete')
			.send({
				id : testFAQType.id
			})
			.end((err , res) => {
				res.statusCode.should.equal(302);
				res.headers.location.should.be.equal('/admin/FAQTypeUpdate');
    	  return done();
			});
	});

	it('FAQType update', (done) =>{

		request(sails.hooks.http.app)
			.post('/admin/FAQTypeUpdate')
			.send({
				name : "測試",
				FAQTypeId : allFAQType,
				FAQType : allFAQType.name
			})
			.end((err , res) => {
				res.statusCode.should.equal(302);
				res.headers.location.should.be.equal('/admin/FAQ');
    	  return done();
			});
	});


});
