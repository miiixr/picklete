describe.only("SelectionActiveService", () => {

  it('get SelectionActive', async (done) => {

    // 測試資料從
    try {

      let selectionActives = await SelectionActiveService.getModel();

      let images = await db.Image.findAll();

      selectionActives.length.should.be.equal(4);
      selectionActives[0].type.should.be.equal("oneLong");
      selectionActives[1].type.should.be.equal("oneBig");
      selectionActives[2].type.should.be.equal("two");
      selectionActives[3].type.should.be.equal("three");

      images[0].SelectionActiveId.should.be.equal(1);
      images[1].SelectionActiveId.should.be.equal(2);
      images[2].SelectionActiveId.should.be.equal(3);
      images[3].SelectionActiveId.should.be.equal(3);
      images[4].SelectionActiveId.should.be.equal(4);
      images[5].SelectionActiveId.should.be.equal(4);
      images[6].SelectionActiveId.should.be.equal(4);

      done();

    } catch (e) {
      done(e);
    }
  });


  it('save SelectionActive', async (done) => {

    // 每次更新皆刪除重建 SelectionActive
    try {

      let selectionActives = [
        {
          type: 'oneLong'
        },{
          type: 'oneBig'
        },{
          type: 'two'
        },{
          type: 'three'
        }
      ]
      let result = await* selectionActives.map((selectionActive) =>
        db.SelectionActive.create(selectionActive)
      );
      let all = await SelectionActiveService.getModel();

      all.length.should.be.equal(8);
      result.length.should.be.equal(4);

      done();

    } catch (e) {
      done(e);
    }
  });
});
