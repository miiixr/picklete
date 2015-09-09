describe("SelectionActiveService", () => {
  it('get SelectionActive', async (done) => {

    // 測試資料從
    try {

      let result = await SelectionActiveService.getModel();

      let selectionActives = result;

      selectionActives.length.length.should.be.equal(4);
      selectionActives[0].link.should.be.equal("oneLong");
      selectionActives[0].Images.length.should.be.equal(1);
      selectionActives[0].Images.should.have.property('link', 'path', 'openWindow');

      selectionActives[1].link.should.be.equal("oneBig");
      selectionActives[1].Images.length.should.be.equal(1);

      selectionActives[2].link.should.be.equal("two");
      selectionActives[2].Images.length.should.be.equal(2);

      selectionActives[3].link.should.be.equal("three");
      selectionActives[3].Images.length.should.be.equal(3);



    } catch (e) {
      done(e);
    }
  });

  it('save SelectionActive', async (done) => {

    // 每次更新皆刪除重建 SelectionActive
    try {

      let selectionActives = [
        {
          type: 'oneLong',
          Images: [{
            link: '1100X160',
            path: ''
          }]
        },{
          type: 'oneBig',
          Images: [{
            link: '1100X350',
            path: ''
          }]
        },{
          type: 'two',
          Images: [{
            link: '545X350',
            path: ''
          },{
            link: '545X350',
            path: ''
          }]
        },{
          type: 'three',
          Images: [{
            link: '360X240',
            path: ''
          },{
            link: '360X240',
            path: ''
          },{
            link: '360X240',
            path: ''
          }]
        }
      ];

      let result = await SelectionActiveService.save(selectionActives);

      result.success.should.be.true;

    } catch (e) {
      done(e);
    }
  });
});
