import moment from 'moment';
describe("about product service", () => {
  let createdProduct, createdProduct2, createdProductGm;
  let productGmA, productGmB, dptA, dptB, dptSubA, dptSubB;
  before(async (done) => {

    try {

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

      createdProductGm = await db.ProductGm.create({
        brandId: 1,
        explain: 'req.body.explain',
        usage: 'req.body.usage',
        notice: 'req.body.notice',
        depId: dptA.id,
        depSubId: dptSubA.id
      });

      await createdProductGm.setDpts([dptA]);
      await createdProductGm.setDptSubs([dptSubA]);


      createdProduct = await db.Product.create({
        color: '1',
        description: '11',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });

      createdProduct2 = await db.Product.create({
        color: '2',
        description: '22',
        productNumber: '22',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });


      done();

    } catch (e) {
      console.log(e.stack);
      done(e);

    }
  });

  it.only('product update', async (done) => {

    try {
      let updateProduct = {
        brandType: 'origin',
        brandId: '2',
        customBrand: 'OTHER',
        dptId: [ dptB.id ],
        dptSubId: [ dptSubB.id ],
        name: '111',
        price: '11',
        country: '11',
        madeby: '11',
        spec: '11',
        size: '11',
        service: [ 'express', 'store', 'package' ],
        comment: '11',
        good:
         [ { color: '1',
             description: '1111111',
             productNumber: '1111111',
             stockQuantity: '999',
             isPublish: 'false',
             id:createdProduct.id },
            { color: '2',
             description: '22222',
             productNumber: '2222',
             stockQuantity: '999',
             isPublish: 'true',
             id:createdProduct2.id } ],
        productGm: {
          id: createdProductGm.id
        },
        explain: '',
        notice: '',
        tag: '咖啡,午茶'
      };

      await ProductService.update(updateProduct);

      let updatedProduct = await db.Product.find({
        where: {id: createdProduct.id},
        include: [{
          model: db.ProductGm
          ,
          include: [
            db.Dpt, db.DptSub
          ]
        }]
      });

      updatedProduct.ProductGm.Dpts[0].id.should.be.equal(dptB.id);
      updatedProduct.ProductGm.DptSubs[0].id.should.be.equal(dptSubB.id)

      done();
    } catch (e) {
      done(e);
    }

  });


  it('product call gm', async (done) => {
    try {
      let productGm = await ProductService.findGmWithImages(createdProductGm.id);
      console.log(productGm.Products);
      productGm.Products.length.should.above(1);
      done();  
    } catch (e) {
      done(e);
    }
    
  });
});
