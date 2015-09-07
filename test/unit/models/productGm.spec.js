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

  describe('many Dpt, many DptSub to productGM ', () => {
    let productGmA, productGmB, dptA, dptB, dptSubA, dptSubB;
    before(async (done) => {

      try {

        productGmA = await db.ProductGm.create({
          explain: 'test explain A',
          usage: 'test usage A',
          notice: 'test notice A',
        });

        productGmB = await db.ProductGm.create({
          explain: 'test explain B',
          usage: 'test usage B',
          notice: 'test notice B',
        });


        dptA = await db.Dpt.create({
          name: 'test 大館 A',
          weight: 999,
          official: true,
        });

        dptB = await db.Dpt.create({
          name: 'test 大館 B',
          weight: 999,
          official: true,
        });

        dptSubA = await db.DptSub.create({
          name: 'test 小館 A',
          weight: 100,
          official: false
        })

        dptSubB = await db.DptSub.create({
          name: 'test 小館 B',
          weight: 100,
          official: false
        })

        await dptA.setDptSubs(dptSubA);
        await dptB.setDptSubs(dptSubB);

        done();


      } catch (e) {
        console.error(e.stack);
        done(e);
      }


    });


    it('productGM set to many Dpt.', async (done) => {
      try {
        await productGmA.setDpts([dptA, dptB]);


        let productGmAWithDpts = await db.ProductGm.find({
          where: {
            id: productGmA.id
          }
          ,
          include: [{
            model: db.Dpt
          }]
        });

        productGmAWithDpts.Dpts.should.be.Array;

        done();
      } catch (e) {
        console.error(e.stack);
        done(e);
      }
    });

    it('productGM set to many DptSubs.', async (done) => {
      try {
        await productGmA.setDptSubs([dptSubA, dptSubB]);


        let productGmAWithDptSubs = await db.ProductGm.find({
          where: {
            id: productGmA.id
          }
          ,
          include: [{
            model: db.DptSub
          }]
        });

        productGmAWithDptSubs.DptSubs.should.be.Array;

        done();
      } catch (e) {
        console.error(e.stack);
        done(e);
      }
    });

    it('Dpts set to many productGM.', async (done) => {
      try {
        await dptA.setProductGms([productGmA, productGmB]);


        let dptAWithProductGms = await db.Dpt.find({
          where: {
            id: dptA.id
          }
          ,
          include: [{
            model: db.ProductGm
          }]
        });

        dptAWithProductGms.ProductGms.should.be.Array;

        done();
      } catch (e) {
        console.error(e.stack);
        done(e);
      }
    });

    it('DptSubs set to many productGM.', async (done) => {
      try {
        await dptSubA.setProductGms([productGmA, productGmB]);


        let dptSubAWithProductGms = await db.DptSub.find({
          where: {
            id: dptSubA.id
          }
          ,
          include: [{
            model: db.ProductGm
          }]
        });

        dptSubAWithProductGms.ProductGms.should.be.Array;

        done();
      } catch (e) {
        console.error(e.stack);
        done(e);
      }
    });

  });

});
