describe.only("about gm prodcut model operation.", () => {
  let createdProductGm = null;

  it('create product gm', async (done) => {
    let newProductGm = {
      brandId: 1,
      dptId: 1,
      dptSubId: 2,
      explain: '這個東西真的很不錯，快點來買 \n 再不快點就買不到囉',
      usage: '這一段是使用說明',
      notice: '這一段是注意事項，請注意喔',
      tag: [
        'kerker',
        '宅宅 der'
      ],
      coverPhoto: [
        'http://localhost:1337/smile.jpg',
        'http://localhost:1337/happy.jpg'
      ]
    };

    createdProductGm = await db.ProductGm.create(newProductGm);

    console.log(createdProductGm);

    createdProductGm.explain.should.be.String;
    done();
  });

});