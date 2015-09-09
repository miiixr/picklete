describe("SelectionActiveService", () => {
  it('get SelectionActive', async (done) => {

    // 測試資料從
    try {

      let result = await SelectionActiveService.getModel();

      let selectionActives = result;

      selectionActives.length.length.should.be.equal(4);
      selectionActives[0].type.should.be.equal("oneLong");
      selectionActives[0].Images.length.should.be.equal(1);

      selectionActives[1].type.should.be.equal("oneBig");
      selectionActives[1].Images.length.should.be.equal(1);

      selectionActives[2].type.should.be.equal("two");
      selectionActives[2].Images.length.should.be.equal(2);

      selectionActives[3].type.should.be.equal("three");
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
            type: '1100X160',
            link: '',
            path: ''
          }]
        },{
          type: 'oneBig',
          Images: [{
            type: '1100X350',
            link: '',
            path: ''
          }]
        },{
          type: 'two',
          Images: [{
            type: '545X350',
            link: '',
            path: ''
          },{
            type: '545X350',
            link: '',
            path: ''
          }]
        },{
          type: 'three',
          Images: [{
            type: '360X240',
            link: '',
            path: ''
          },{
            type: '360X240',
            link: '',
            path: ''
          },{
            type: '360X240',
            link: '',
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
