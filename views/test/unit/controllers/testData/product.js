
let testDataPid;

module.exports = {


  testData: async () => {

    //  step 1
    let createdDpt = await db.Dpt.create({
      name: 'spec dpt',
      weight: 999,
      official: true,
    });

    // step 2
    let createdDptSub = await db.DptSub.create({
      name: 'spec dptSub',
      weight: 100,
      official: false
    })

    // step 3
    await createdDpt.setDptSubs(createdDptSub);

    // step 4
    let createdProductGmGood = await db.ProductGm.create({
      brandId: 1,
      name: 'spec',
      explain: 'specspec',
      usage: 'specspecspec',
      notice: '18 specspecspec',
      depId: createdDpt.id,
      depSubId: createdDptSub.id,
      coverPhoto: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-22.jpg',
        'https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg']
    });

    // step 5
    await createdProductGmGood.setDpts([createdDpt]);
    await createdProductGmGood.setDptSubs([createdDptSub]);

    // step 6
    let productNames = ['test黃金曼特寧', 'test夏威夷可娜', 'test耶加雪夫',
      'test肯亞AA', 'test巴西喜拉朵', 'test薇薇特南果', 'test薩爾瓦多伊莎貝爾',
      'test瓜地馬拉．安提瓜．花神', 'test星巴克過期豆'];

    var xs = []
    for (var i=0; i < productNames.length; i++) {
      var x = await db.Product.create({
        weight: [i],
        name: productNames[i],
        description: '超級精選' + productNames[i] + '咖啡豆',
        stockQuantity: 1111,
        isPublish: true,
        price: 1399,
        size: 'normal',
        service: ["express"],
        country: 'U.K',
        madeby: 'TW',
        color: 3,
        productNumber: '2-USA-3-G',
        spec: 'super-metal',
        photos: ["https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg",
          "https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-22.jpg"]
      });
      xs.push(x);
      console.log('______--------__________-------------______________');
    }

    // step 7
    await createdProductGmGood.setProducts(xs);

    testDataPid = xs[0];

    console.log('=== createdProductGmGood ===>\n',createdProductGmGood);

    return {
      gmName: createdProductGmGood.name,
      gmId: createdProductGmGood.id,
      pId: testDataPid.id,
      pTotal: xs.length
    };
  } // end


};
