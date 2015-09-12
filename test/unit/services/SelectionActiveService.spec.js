describe.only("SelectionActiveService", () => {

  it('get SelectionActive', async (done) => {

    // 測試資料從
    try {

      let result = await SelectionActiveService.getModel();

      let selectionActives = result;

      // console.log('=== result ==>',result);
      // console.log('=== selectionActives.length ==>',selectionActives.length);
      // console.log('=== selectionActives[0].Images.url ==>',selectionActives[0].Images[0].url);
      // console.log('=== selectionActives[0].Images[0] ==>',selectionActives[0].Images[0].url);

      selectionActives.length.should.be.equal(4);
      selectionActives[0].type.should.be.equal("oneLong");
      selectionActives[0].Images.length.should.be.equal(1);
      selectionActives[0].Images[0].toJSON().should.have.keys(
        'SelectionActiveId',
        'createdAt',
        'updatedAt',
        'id',
        'url',
        'path',
        'openWindow');

      selectionActives[1].type.should.be.equal("oneBig");
      selectionActives[1].Images.length.should.be.equal(1);

      selectionActives[2].type.should.be.equal("two");
      selectionActives[2].Images.length.should.be.equal(2);

      selectionActives[3].type.should.be.equal("three");
      selectionActives[3].Images.length.should.be.equal(3);

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
          type: 'oneLong',
          Images: [{
            url: 'http://fakeimg.pl/1100x160',
            path: ''
          }]
        },{
          type: 'oneBig',
          Images: [{
            url: 'http://fakeimg.pl/1100x350',
            path: ''
          }]
        },{
          type: 'two',
          Images: [{
            url: 'http://fakeimg.pl/545x350',
            path: ''
          },{
            url: 'http://fakeimg.pl/545x350',
            path: ''
          }]
        },{
          type: 'three',
          Images: [{
            url: 'http://fakeimg.pl/360x240',
            path: ''
          },{
            url: 'http://fakeimg.pl/360x240',
            path: ''
          },{
            url: 'http://fakeimg.pl/360x240',
            path: ''
          }]
        }
      ];

      let result = await SelectionActiveService.save(selectionActives);

      result.success.should.be.true;

      done();
    } catch (e) {
      done(e);
    }
  });
});
