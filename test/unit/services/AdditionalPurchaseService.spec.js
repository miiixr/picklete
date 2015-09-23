
describe.only("Additional Purchase", () => {
  var additionalPurchaseLimited = {};
  var additionalPurchase = {};
  before(async () => {
    let createdProductA = await db.Product.create({
      name: '超值組 spec A',
      description: '讚讚讚',
      stockQuantity: '100',
      isPublish: 'true',
      price: 999,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'TW',
      color: 3,
      productNumber: '1-USA-2-G',
      spec: 'super-metal',
      photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
    });

    let createdProductB = await db.Product.create({
      name: '超值組 spec B',
      description: '讚讚讚',
      stockQuantity: '100',
      isPublish: 'true',
      price: 999,
      size: 'normal',
      service: ["express"],
      country: 'U.K',
      madeby: 'TW',
      color: 3,
      productNumber: '1-USA-2-G',
      spec: 'super-metal',
      photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
    });


    additionalPurchaseLimited = {
      name: '加價購測試商品 limted spec ' ,
      limit: 1500,
      discount: 100,
      startDate: new Date(2000, 9, 7),
      endDate: new Date(2000, 9, 11)


    }

    additionalPurchaseLimited = await db.AdditionalPurchase.create(additionalPurchaseLimited);
    await additionalPurchaseLimited.setProduct(createdProductA)

    additionalPurchase = {
      name: '加價購測試商品 unlimted spec ' ,
      limit: 0,
      discount: 100,
      startDate: new Date(2000, 9, 7),
      endDate: new Date(2000, 9, 11)
    }

    additionalPurchase = await db.AdditionalPurchase.create(additionalPurchase);
    await additionalPurchase.setProduct(createdProductB)

  });

  it('get Current Item with paymentTotalAmount=1000 should get one additional Purchase', async (done) => {

    try {
      let date = new Date(2000, 9, 9)
      let query = {date, paymentTotalAmount: 1000}
      let additionalPurchases = await AdditionalPurchaseService.getCurrentItem(query);

      additionalPurchases.length.should.be.equal(1);
      additionalPurchases[0].Product.should.be.Object;

      done();

    } catch (e) {

      done(e);

    }

  });

  it('get Current Item with paymentTotalAmount=2000 should get two additional Purchases', async (done) => {

    try {
      let date = new Date(2000, 9, 9)
      let query = {date, paymentTotalAmount: 2000}
      let additionalPurchases = await AdditionalPurchaseService.getCurrentItem(query);

      additionalPurchases.length.should.be.equal(2);
      additionalPurchases[1].Product.should.be.Object;

      done();

    } catch (e) {

      done(e);

    }

  });



});
