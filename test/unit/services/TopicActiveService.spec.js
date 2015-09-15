describe.only("TopicActiveService", () => {

  it('get TopicActive', async(done) => {

    // 測試資料從
    try {

      let result = await TopicActiveService.getModel();

      let topicActives = result;

      // console.log('=== result ==>',result);
      // console.log('=== selectionActives.length ==>',selectionActives.length);
      // console.log('=== selectionActives[0].Images.url ==>',selectionActives[0].Images[0].url);
      // console.log('=== selectionActives[0].Images[0] ==>',selectionActives[0].Images[0].url);
      console.log(JSON.stringify(topicActives, null, 4));
      topicActives.length.should.be.equal(2);
      topicActives[0].title.should.be.equal("title1");
      topicActives[0].toJSON().should.have.keys(
        'title',
        'createdAt',
        'updatedAt',
        'id',
        'weight',
        'ImageAId',
        'ImageA1Id',
        'ImageA2Id',
        'ImageBId',
        'ImageB1Id',
        'ImageB2Id',
        'ImageCId',
        'ImageC1Id',
        'ImageC2Id',
        'ImageA',
        'ImageA1',
        'ImageA2',
        'ImageB',
        'ImageB1',
        'ImageB2',
        'ImageC',
        'ImageC1',
        'ImageC2'
      );

      topicActives[1].title.should.be.equal("title2");

      done();
    } catch (e) {
      done(e);
    }
  });


  it('save topicActive', async(done) => {

    // 每次更新皆刪除重建 SelectionActive
    try {

      let topicActives = [{
        "id": 2,
        "title": "title2",
        "weight": 0,
        "Images": [
          {"ImageA": {"path": 'http://fakeimg.pl/1100x160'}},
          {"ImageA1": {"path": 'http://fakeimg.pl/1100x160'}},
          {"ImageA2": {"path": 'http://fakeimg.pl/1100x160'}},
          {"ImageB": {"path": 'http://fakeimg.pl/600x800'}},
          {"ImageB1": {"path": 'http://fakeimg.pl/600x800'}},
          {"ImageB2": {"path": 'http://fakeimg.pl/600x800'}},
          {"ImageC": {"path": 'http://fakeimg.pl/1200x400'}},
          {"ImageC1": {"path": 'http://fakeimg.pl/1200x400'}},
          {"ImageC2": {"path": 'http://fakeimg.pl/1200x400'}}
        ]
      }];

      let result = await TopicActiveService.save(topicActives);

      result.success.should.be.true;

      done();
    } catch (e) {
      done(e);
    }
  });
});
