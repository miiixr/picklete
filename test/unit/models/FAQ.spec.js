describe("about FAQ model operation.", () => {
	let createFAQ = null;

	it('creat FAQ' , async(done) => {
		
		try{
        let FAQData = {
  			title: "test",
  			answer: "test",
    		};
  		createFAQ = await db.FAQ.create(FAQData);

  		createFAQ.title.should.be.String;
  		done();
    } catch(e) {
      done(e);
    }
	});

	it('read all FAQ' , async (done) => {
		try {
			let FAQs = await db.FAQ.findAll();
			FAQs.should.be.Array;
			done();

		} catch(e) {
			done(e);
		}
	});

  it('find FAQ id = createFAQ.id', async (done) => {
    try {
      let theFAQ = await db.FAQ.findById(createFAQ.id);
      theFAQ.should.be.Object;
      theFAQ.id.should.be.equal(createFAQ.id);
      done();
    } catch (e) {
      done(e);
    }
  });


  it('update FAQ', async (done) => {
    try {
      let theFAQ = await db.FAQ.findById(createFAQ.id);
      theFAQ.title='FAQ title change'
      theFAQ = await theFAQ.save();
      theFAQ.should.be.Object;
      theFAQ.title.should.be.equal('FAQ title change');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('destroy FAQ', async (done,err) => {
    try {
      let theFAQ = await db.FAQ.findById(createFAQ.id);
      if (!theFAQ){
        done();
      }
      console.log(theFAQ);
      await theFAQ.destroy();
      let afterDestroyFAQFindAgain = await db.FAQ.findById(createFAQ.id);
      (afterDestroyFAQFindAgain === null).should.be.true;
      done();
    } catch (e) {
      done(e);
    }
  });

});