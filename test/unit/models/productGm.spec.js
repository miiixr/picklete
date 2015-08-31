describe("about gm prodcut model operation.", () => {
  let createdProductGm = null;

  it('create product gm', async (done) => {
    let newProductGm = {
      // 品牌 id
      brandId: 1,
      // 大管標籤
      dptId: 1,
      // 小館標籤
      dptSubId: 2,
      // 商品說明
      explain: '這個東西真的很不錯，快點來買 \n 再不快點就買不到囉',
      // 使用方法
      usage: '這一段是使用說明',
      // 注意事項
      notice: '這一段是注意事項，請注意喔',
      // tag
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

    createdProductGm.explain.should.be.String;
    done();
  });

});
