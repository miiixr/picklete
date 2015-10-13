module.exports.createTestData = async () => {

  let like = [
    {title: '最愛不需要麻煩的水果'},
    {title: '注重健康有機'},
    {title: '新鮮最重要'},
    {title: '產地直送最好'},
    {title: '在地合時宜的水果讚'},
    {title: '新鮮果汁與果醬'}
  ];

  await db.Like.bulkCreate(like);

  var cloud = {
    name: '雲端農場',
    avatar: 'https://lh3.googleusercontent.com/trLzZYhuCnQz6gl_QM0XIPRWp9ty0ZMGe59vFnAF_iHp=s0',
    type: 'PRIME_GOOD',
    desc: '',
    banner: '',
    photos: []
  };

  var cloud = await db.Brand.create(cloud);

  var brandExample = [{
    name: '許順利先生',
    avatar: 'http://dev.agricloud.cc:3000/img/portrait3.jpg',
    type: 'PRIME_GOOD',
    desc: '希望社會更加重視食安問題',
    banner: 'https://cldup.com/u4aO1VQKny.jpg',
    photos: [
      'http://goo.gl/IRT1EM',
      'http://goo.gl/p9Y2BF'
    ]
  },{
    name: '朱清輝先生',
    avatar: 'http://dev.agricloud.cc:3000/img/portrait1.jpg',
    type: 'PRIME_GOOD',
    desc: '把最安全的水果給好朋友與消費者',
    banner: 'https://cldup.com/u4aO1VQKny.jpg',
    photos: [
    'http://goo.gl/IRT1EM',
    'http://goo.gl/p9Y2BF'
    ]
  }];

  var brand = await db.Brand.bulkCreate(brandExample);

  var dpt = await db.Dpt.create({
    name: '水果' ,
    weight: 1,
    official: true,
  });

  var dptSub = await db.DptSub.create({
    name: '柚子' ,
    weight: 1,
    official: true
  });
  var dptSub2 = await db.DptSub.create({
    name: '柳丁' ,
    weight: 1,
    official: true
  });


  await dpt.setDptSubs([dptSub, dptSub2]);

  var createdProductGmComplete = await db.ProductGm.create({
    BrandId: 1,
    name: "月圓人團圓好吃柚子",
    explain: '好吃食品就是要吃，吃吃吃',
    usage: '請安心食用',
    notice: '6 歲以上請多食用',
    coverPhoto: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  });

  await createdProductGmComplete.setDpts([dpt]);
  await createdProductGmComplete.setDptSubs([dptSub]);

  let createdProduct =[{
    name: '圓滿柚',
    description: '每箱六台斤 甜度 ★★★',
    stockQuantity: 100,
    price: 500,
    ProductGmId: createdProductGmComplete.id,
    photos: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  },{
    name: '團圓柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 625,
    ProductGmId: createdProductGmComplete.id,
    photos: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  },{
    name: '平安柚',
    description: '每箱六台斤 甜度 ★★★★',
    stockQuantity: 100,
    price: 750,
    ProductGmId: createdProductGmComplete.id,
    photos: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  },{
    name: '【特級】團圓柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 950,
    ProductGmId: createdProductGmComplete.id,
    photos: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  },{
    name: '【特級】平安柚',
    description: '每箱六台斤 甜度 ★★★★★',
    stockQuantity: 100,
    price: 1200,
    ProductGmId: createdProductGmComplete.id,
    photos: [
      'http://dev.agricloud.cc:3000/img/cover2.jpg',
      'http://dev.agricloud.cc:3000/img/cover1.jpg'
    ]
  }];
  await db.Product.bulkCreate(createdProduct);

  let bonusPoint = {
    email: 'smlsun@gmail.com',
    remain: 100
  }


  await db.BonusPoint.create(bonusPoint);


  // create company
  let companyObj = {
    avatar: "https://lh3.googleusercontent.com/trLzZYhuCnQz6gl_QM0XIPRWp9ty0ZMGe59vFnAF_iHp=s0",
    name: "agricloud",
    fullname: "創毅資訊股份有限公司",
    email: "hq@picklete.com",
    desc: "週一至週五 早上10:00 -下午5:00",
    line: "https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/contact.png"
  };

  await db.Company.create(companyObj);

  let shopcode = {
      title: '滿 500 折 100',
      code: '1234ABCD',
      autoRandomCode: 'on',
      startDate: '1970-01-01',
      endDate: '1970-01-01',
      type: 'price',
      description: 100,
      restriction: 500,
      sentType: 'all',
      sentContent: '滿 500 折 100 !!',
      restrictionDate: 'on'
    };
  await db.ShopCode.create(shopcode);

  var promotion = {
    title : '全商品打 5 折!',
    description : '',
    startDate : new Date(2014, 1, 1),
    endDate : new Date(2020, 1, 1),
    discount : 0.5,
    type : 'general',
    discountType:'discount'
  }
  var createPromotion = await db.Promotion.create(promotion);
  await createPromotion.setProducts([1, 2, 3, 4]);

  let testDatas = [
  {
    type: 'postoffice',
    region: '台灣本島',
    fee: '100'
  },{
    type: 'delivery',
    region: '台灣本島',
    fee: '150'
  }];
  await* testDatas.map(async (testData) => {
    return await db.Shipping.create(testData);
  });


  // slide active
  let slideObj = [{
    cover: 'http://cdn1.editmysite.com/uploads/2/5/7/0/25701590/background-images/743698345.jpg',
    title: '柳橙香',
    description: '好香的大柳橙',
    location: 'caption-right caption-top',
    color: '#fff',
    link: 'http://tw.tw'
  }, {
    cover: 'http://dev.agricloud.cc:3000/img/cover1.jpg',
    title: '團員大香柚',
    description: '香甜又好吃',
    location: 'caption-center caption-middle',
    color: '#fff',
    link: 'http://tw.com'
  }]

  await db.Slider.bulkCreate(slideObj);


  // selectionActive EXCLUSIVES
  let images = [
    {
      path: 'https://cldup.com/ajrNdux7HG.jpg',
      url: 'http://fakeimg.pl/1100x160'
    },{
      path: 'https://cldup.com/aDqu4Jae_3.jpg',
      url: 'http://fakeimg.pl/1100x350'
    },{
      path: 'https://d15ds55abggjxg.cloudfront.net/project_content/7c62f1656e452f08b7e83ab5a5ab10e5.png',
      url: 'http://fakeimg.pl/545x350'
    },{
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/8468962.jpg',
      url: 'http://fakeimg.pl/545x350'
    },{
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/5144971.png',
      url: 'http://fakeimg.pl/360x240'
    },{
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/6318005.jpg',
      url: 'http://fakeimg.pl/360x240'
    },{
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/8760446.jpg',
      url: 'http://fakeimg.pl/360x240'
    },
    // image 7, 8 for top active
    {
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/6278972.jpg',
      url: 'http://fakeimg.pl/500x500'
    },{
      path: 'http://agricloud.cc/uploads/2/5/7/0/25701590/1721895.jpg',
      url: 'http://fakeimg.pl/500x500'
    }
  ]
  let createdImages = await* images.map((image) => db.Image.create(image));

  let selectionActives = [
    {
      type: 'oneLong',
      weight: 70
    },{
      type: 'oneBig',
      weight: 80
    },{
      type: 'two',
      weight: 90
    },{
      type: 'three',
      weight: 100
    }
  ]
  let createdSelectionActive = await* selectionActives.map((selectionActive) =>
    db.SelectionActive.create(selectionActive)
  );

  await createdSelectionActive[0].setImages([createdImages[0]]);
  await createdSelectionActive[1].setImages([createdImages[1]]);
  await createdSelectionActive[2].setImages([createdImages[2], createdImages[3]]);
  await createdSelectionActive[3].setImages([createdImages[4], createdImages[5], createdImages[6]]);

}
