describe("about FAQType model operation.", () => {
  let createFAQType = null;

  it('create FAQType', async (done) => {
    try{
      let newFAQType = {
        name: "毫無反應 只是個測試"
      };

      createFAQType = await db.FAQType.create(newFAQType);

      createFAQType.name.should.be.String;
      done();
    } catch(e) {
      done(e);
    }
  });

  it('read all FAQType' , async (done) => {
    try {
      let FAQTypes = await db.FAQType.findAll();
      FAQTypes.should.be.Array;
      done();

    } catch(e) {
      done(e);
    }
  });

  it('find FAQType id = createFAQType.id', async (done) => {
    try {
      let theFAQType = await db.FAQType.findById(createFAQType.id);
      theFAQType.should.be.Object;
      theFAQType.id.should.be.equal(createFAQType.id);
      done();
    } catch (e) {
      done(e);
    }
  });


  it('update FAQType', async (done) => {
    try {
      let theFAQType = await db.FAQType.findById(createFAQType.id);
      theFAQType.title='FAQType title change'
      theFAQType = await theFAQType.save();
      theFAQType.should.be.Object;
      theFAQType.title.should.be.equal('FAQType title change');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('destroy FAQType', async (done,err) => {
    try {
      let theFAQType = await db.FAQType.findById(createFAQType.id);
      if (!theFAQType){
        done();
      }
      console.log(theFAQType);
      await theFAQType.destroy();
      let afterDestroyFAQTypeFindAgain = await db.FAQType.findById(createFAQType.id);
      (afterDestroyFAQTypeFindAgain === null).should.be.true;
      done();
    } catch (e) {
      done(e);
    }
  });


});
