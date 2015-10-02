  import path from 'path';

  // simulate login
  var sinon = require('sinon');

  // import test data foler
  let testData = require('./testData/product.js');
  let testProduct;
  let testProductId, testProductTotal;
  let testProductGmId, testProductGmName;

describe("about Product", () => {

  // before testing
  before(async (done) => {

    // simulate login
    sinon.stub(UserService, 'getLoginState', (req) => {
      return true;
    });

    // get pre-built product/prouctGm infos
    testProduct = await testData.testData();
    testProductId = testProduct.pId;
    testProductTotal = testProduct.pTotal;
    testProductGmId = testProduct.gmId;
    testProductGmName = testProduct.gmName;
    // console.log('=== testProduct ==>\n',testProduct);

    done();
  });
  // end before

  // after testing
  after((done) => {

    // simulated loginout
    UserService.getLoginState.restore();

    done();
  });
  // end after

  // get update view
  it('show update', (done) => {
    request(sails.hooks.http.app)
    .get(`/admin/goods/update?id=${testProductGmId}&responseType=json`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body.good. ===>',res.body.good.Products[0]);
      res.statusCode.should.equal(200);
      res.body.good.id.should.be.equal(testProductGmId);
      res.body.good.name.should.be.equal(testProductGmName);
      res.body.good.Products.length.should.be.equal(testProductTotal);
      res.body.good.Products.forEach(product => {
        product.id.should.be.number;
        product.ProductGmId.should.be.equal(testProductGmId);
      });
      done(err);
    });
  });
  // end get update view

  // do update
  it('do update', (done) => {
    request(sails.hooks.http.app)
    .post(`/admin/goods/update?responseType=json`)
    .send({ good:
     [ { id: testProductId,
         weight: '0',
         'photos-1': '',
         'photos-2': '',
         color: '3',
         name: 'changed',
         productNumber: '1-USA-2-G',
         stockQuantity: '100',
         isPublish: 'true' } ],
    productGm: { id: testProductGmId },
    brandType: 'origin',
    brandId: '1',
    customBrand: '',
    dptId: [ '8' ],
    dptSubId: [ '22' ],
    name: '好東西商品',
    price: '999',
    country: 'U.K',
    madeby: 'TW',
    spec: 'super-metal',
    size: 'normal',
    service: [ 'express' ],
    comment: '',
    coverPhoto:
     [ 'https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/JC1121-set-My-Mug-blue-2.jpg',
       '' ],
    explain: '<p>好東西就是要買，買買買</p>\r\n',
    notice: '<p>18 歲以下請勿使用</p>\r\n',
    tag: '' })
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body ==>',res.body);
      res.statusCode.should.equal(200);
      res.body.id.should.be.equal(testProductId);
      res.body.ProductGmId.should.be.equal(testProductGmId);
      res.body.name.should.be.equal('changed');
      done(err);
    });
  });
  // end do update

  // do create
  it('do create', (done) => {
    request(sails.hooks.http.app)
    .post(`/admin/goods/create?responseType=json`)
    .send({ brandType: 'origin',
      brandId: '1',
      customBrand: '',
      dptId: [ '1' ],
      dptSubId: [ '1' ],
      name: 'test',
      price: '1',
      country: '1',
      madeby: '1',
      spec: '1',
      size: '1',
      service: [ 'express', 'store', 'package' ],
      comment: '1',
      good:
       [ { weight: '0',
           'photos-1': '',
           'photos-2': '',
           color: '1',
           name: '111',
           productNumber: '1',
           stockQuantity: '999',
           isPublish: 'false' } ],
      coverPhoto: [ '' ],
      explain: '',
      notice: '',
      tag: '' })
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body ==>',res.body);
      res.statusCode.should.equal(200);
      res.body.id.should.be.number;
      res.body.ProductGmId.should.be.number;
      done(err);
    });
  });
  // end do create

  // list all
  it('show good list', (done) => {
    request(sails.hooks.http.app)
    .get(`/admin/goods?responseType=json`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      console.log('=== res.body.products ==>', res.body.products);
      res.statusCode.should.equal(200);
      res.body.pageName.should.be.equal("/admin/goods");
      res.body.query.responseType.should.be.equal("json");
      res.body.brands.forEach(brand => {
        brand.name.should.be.String;
      });
      res.body.dpts.forEach(dpt => {
        dpt.name.should.be.String;
      });
      res.body.products.forEach(product => {
        product.id.should.be.number;
        product.ProductGmId.should.be.number;
      });
      done(err);
    });
  });
  // end list all

  // delete productGm
  it('delete productGm', (done) => {
    request(sails.hooks.http.app)
    .post(`/admin/goods/delete`)
    .send({id:1, jsonOut: true})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      console.log('=== res.body ==>\n',res.body);
      console.log('=== res.body.id ==>\n',res.body.id);
      console.log('=== res.body.deletedAt ==>\n',res.body.deletedAt);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.id.should.equal(1);
      res.body.deletedAt.should.be.Date;
      done();
    });
  });
  // end delete productGm



  it('create a product for one type, origin brandType, test about - ProductController.createUpdate', (done) => {

    request(sails.hooks.http.app)
    .post('/admin/goods/create')
    // .set('cookie', cookie)
    .field('brandType', 'origin') // origin, custom,
    .field('brandId', '1')
    .field('dptId[]', JSON.stringify([ '1', '2', '3' ]))
    .field('dptSubId[]', JSON.stringify([ '1', '4', '8' ]))
    .field('name', 'product GM name')
    .field('price', '2222')
    .field('country', 'TW')
    .field('madeby', 'TW')
    .field('spec', 'red')
    .field('size', '100*20')
    .field('service[]', JSON.stringify([ 'express', 'store', 'package' ]))
    .field('comment', 'keker')
    .field('good[][color]', 1)
    .field('good[][description]', 'description1')
    .field('good[][productNumber]', 'productNumber1')
    .field('good[][stockQuantity]', 999)
    .field('good[][photos-1]', 'url1')
    .field('good[][isPublish]', 'false')
    .field('coverPhoto[]', 'photos1')
    .field('explain', '<p>introduce</p>\r\n')
    .field('notice', '<p>notice</p>\r\n')
    .field('tag', '兒童,學生')
    .end(function(err, res) {
      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/goods/');

      return done();
    });
  });

  it('create a product for one type, custom brandType, test about - ProductController.createUpdate', (done) => {

    request(sails.hooks.http.app)
    .post('/admin/goods/create')
    // .set('cookie', cookie)
    .field('brandType', 'custom') // origin, custom,
    .field('customBrand', 'otherBrand')
    .field('dptId[]', JSON.stringify([ '1', '2', '3' ]))
    .field('dptSubId[]', JSON.stringify([ '1', '4', '8' ]))
    .field('name', 'product GM name')
    .field('price', '2222')
    .field('country', 'TW')
    .field('madeby', 'TW')
    .field('spec', 'red')
    .field('size', '100*20')
    .field('service[]', JSON.stringify([ 'express', 'store', 'package' ]))
    .field('comment', 'keker')
    .field('good[][color]', 1)
    .field('good[][description]', 'description1')
    .field('good[][productNumber]', 'productNumber1')
    .field('good[][stockQuantity]', 999)
    .field('good[][photos-1]', 'url1')  // 1
    .field('good[][photos-2]', 'url2')  // 1
    .field('good[][isPublish]', 'false')
    .field('coverPhoto[]', 'photos1')
    .field('coverPhoto[]', 'photos2')
    .field('explain', '<p>introduce</p>\r\n')
    .field('notice', '<p>notice</p>\r\n')
    .field('tag', '兒童,學生')
    .end(function(err, res) {
      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/goods/');

      return done();
    });
  });

  it('create a product for multiple type, test about - ProductController.createUpdate', (done) => {

    request(sails.hooks.http.app)
    .post('/admin/goods/create')
    // .set('cookie', cookie)
    .field('brandType', 'custom') // other, PRIEM, AGENT
    .field('brandName', 'otherBrand')
    .field('name', 'kerkerker')
    .field('brandId', 1)
    .field('dptId', '1')
    .field('dptSubId', '1')
    .field('name', 'product GM name')
    .field('price', '2222')
    .field('country', 'TW')
    .field('madeby', 'TW')
    .field('spec', 'red')
    .field('size', '100*20')
    .field('service', 'express')
    .field('service', 'store')
    .field('service', 'package')
    .field('comment', 'keker')
    .field('good[0][color]', 1)
    .field('good[1][color]', 2)
    .field('good[0][description]', '款式 1')
    .field('good[1][description]', '款式 2')
    .field('good[0][productNumber]', 'productNumber1')
    .field('good[1][productNumber]', 'productNumber2')
    .field('good[0][stockQuantity]', 999)
    .field('good[1][stockQuantity]', 999)
    .field('good[0][photos-1]', 'http://i.imgur.com/TeVEDMX.png')  // 1
    .field('good[1][photos-1]', 'http://i.imgur.com/TeVEDMX.png')  // 1
    .field('good[0][photos-2]', 'http://i.imgur.com/AD0FyWG.png')  // 1
    .field('good[1][photos-2]', 'http://i.imgur.com/AD0FyWG.png')  // 1
    .field('good[0][isPublish]', 'true')
    .field('good[1][isPublish]', 'false')
    .field('coverPhoto', 'http://i.imgur.com/AD0FyWG.png')
    .field('coverPhoto', 'http://i.imgur.com/AD0FyWG.png')
    .field('explain', '<p>introduce</p>\r\n')
    .field('notice', '<p>notice</p>\r\n')
    .field('tag', '兒童,學生')
    .end(function(err, res) {
      res.statusCode.should.be.equal(302);
      res.headers.location.should.be.equal('/admin/goods/');

      return done();
    });
  });

  // it(' create a product,single data, test about - ProductController.createUpdate', (done) => {

  //   request(sails.hooks.http.app)
  //   .post('/admin/goods/create')
  //   .set('cookie', cookie)
  //   .field('brandType', 'origin')
  //   .field('brandId', 2)
  //   .field('dptId[]', '2')
  //   .field('dptSubId[]', '5')
  //   .field('name', 'product GM name')
  //   .field('price', '2222')
  //   .field('country', '423423')
  //   .field('madeby', '423423')
  //   .field('spec', 'red')
  //   .field('size', '100*20')
  //   .field('service[]', JSON.stringify([ 'express', 'store', 'package' ]))
  //   .field('comment', '423432')
  //   .field('good[0][color]', '1')
  //   .field('good[0][description]', '4324')
  //   .field('good[0][productNumber]', '4324')
  //   .field('good[0][stockQuantity]', '4324')
  //   .field('good[0][isPublish]', 'false')
  //   .field('explain', '<p>introduce</p>\r\n')
  //   .field('notice', '<p>notice</p>\r\n')
  //   .field('tag', '兒童,學生')
  //   .end(function(err, res) {
  //     res.statusCode.should.be.equal(302);
  //     res.headers.location.should.be.equal('/admin/goods/');

  //     return done();
  //   });

  // });


  // it(' create a product,Image file, test about - ProductController.createUpdate', (done) => {
  //   var avatar = path.join(process.cwd(), './test/unit/resources/avatar.jpg');
  //   var brand = path.join(process.cwd(), './test/unit/resources/brand.jpg');
  //   var banner = path.join(process.cwd(), './test/unit/resources/brand.jpg');
  //   var photos1 = path.join(process.cwd(), './test/unit/resources/photos1.jpg');
  //   var photos2 = path.join(process.cwd(), './test/unit/resources/photos2.jpg');

  //   request(sails.hooks.http.app)
  //   .post('/admin/goods/create')
  //   .set('cookie', cookie)
  //   .field('brandType', '好棒棒品牌')
  //   .field('brandId', 1)
  //   .field('dptId[]', JSON.stringify([ '1', '2', '3' ]))
  //   .field('dptSubId[]', JSON.stringify([ '1', '4', '8' ]))
  //   .field('name', 'product GM name')
  //   .field('price', '2222')
  //   .field('country', 'TW')
  //   .field('madeby', 'TW')
  //   .field('spec', 'red')
  //   .field('size', '100*20')
  //   .field('service[]', JSON.stringify([ 'express', 'store', 'package' ]))
  //   .field('comment', 'keker')
  //   .field('good[0][color]', JSON.stringify([ '1', '1' ]))
  //   .field('good[0][description]', JSON.stringify([ 'CUP', 'CUP2' ]))
  //   .field('good[0][productNumber]', JSON.stringify([ '0001', '0002' ]))
  //   .field('good[0][stockQuantity]', JSON.stringify([ 999, 999]))
  //   .field('good[0][isPublish]', 'false')
  //   .field('explain', '<p>introduce</p>\r\n')
  //   .field('notice', '<p>notice</p>\r\n')
  //   .field('tag', '兒童,學生')



  //   // .field('type', 'PRIME_GOOD')
  //   // .field('desc', 'Steve Aoki 最棒惹')
  //   // .attach('avatar', avatar)
  //   // .attach('brand', brand)
  //   .attach('good[0][photos][]', banner)
  //   .attach('good[0][photos][]', banner)
  //   .attach('good[0][photos][]', banner)
  //   .attach('coverPhoto[]', photos1)
  //   .attach('coverPhoto[]', photos2)

  //   // .attach('photos[]', photos1)
  //   // .attach('photos[]', photos2)
  //   .end(function(err, res) {
  //     res.statusCode.should.be.equal(302);
  //     res.headers.location.should.be.equal('/admin/goods/');

  //     return done();
  //   });

  // });


  // it(' create a product,Single file, test about - ProductController.createUpdate', (done) => {
  //   var avatar = path.join(process.cwd(), './test/unit/resources/avatar.jpg');
  //   var brand = path.join(process.cwd(), './test/unit/resources/brand.jpg');
  //   var banner = path.join(process.cwd(), './test/unit/resources/brand.jpg');
  //   var photos1 = path.join(process.cwd(), './test/unit/resources/photos1.jpg');
  //   var photos2 = path.join(process.cwd(), './test/unit/resources/photos2.jpg');

  //   request(sails.hooks.http.app)
  //   .post('/admin/goods/create')
  //   .set('cookie', cookie)
  //   .field('brandType', '好棒棒品牌')
  //   .field('brandId', 1)
  //   .field('dptId[]', JSON.stringify([ '1', '2', '3' ]))
  //   .field('dptSubId[]', JSON.stringify([ '1', '4', '8' ]))
  //   .field('name', 'product GM name')
  //   .field('price', '2222')
  //   .field('country', 'TW')
  //   .field('madeby', 'TW')
  //   .field('spec', 'red')
  //   .field('size', '100*20')
  //   .field('service[]', JSON.stringify([ 'express', 'store', 'package' ]))
  //   .field('comment', 'keker')
  //   .field('good[0][color]', JSON.stringify([ '1', '1' ]))
  //   .field('good[0][description]', JSON.stringify([ '111', '22222' ]))
  //   .field('good[0][productNumber]', JSON.stringify([ '0001', '0002' ]))
  //   .field('good[0][stockQuantity]', JSON.stringify([ 999, 999]))
  //   .field('good[0][isPublish]', 'true')
  //   .field('explain', '<p>introduce</p>\r\n')
  //   .field('notice', '<p>notice</p>\r\n')
  //   .field('tag', '兒童,學生')
  //   .attach('good[0][photos][]', banner)
  //   .attach('good[0][photos][]', banner)
  //   .attach('coverPhoto[]', photos1)
  //   .attach('coverPhoto[]', photos2)
  //   .end(function(err, res) {
  //     res.statusCode.should.be.equal(302);
  //     res.headers.location.should.be.equal('/admin/goods/');

  //     return done();
  //   });

  // });

  //
  // old things
  //
  // // add
  // it('add', (done) => {
  //   var product = {
  //     name: 'specAdd',
  //     description: '10斤裝',
  //     stockQuantity: 10,
  //     price: 999,
  //     image: 'http://localhost:1337/images/product/1.jpg',
  //     isPublish: true,
  //     comment: 'this is a comment.'
  //   };
  //   request(sails.hooks.http.app)
  //   .post(`/api/product/`)
  //   .send({product})
  //   .end((err,res) => {
  //     if(res.statusCode === 500){
  //       return done(err);
  //     }
  //     res.statusCode.should.equal(200);
  //     res.body.should.be.Object;
  //     res.body.name.should.equal("specAdd");
  //     res.body.id.should.be.number;
  //     done(err);
  //   });
  // });
  // // end add
  //
  // // publish
  // it('publish', (done) => {
  //   request(sails.hooks.http.app)
  //   .put(`/api/product/publish/${testProduct.id}`)
  //   .end((err,res) => {
  //     if(res.statusCode === 500){
  //       return done(err);
  //     }
  //     res.statusCode.should.equal(302);
  //     // res.statusCode.should.equal(200);
  //     // res.body.should.be.Object;
  //     // res.body.isPublish.should.equal(true);
  //     done(err);
  //   });
  // });
  // // end publish
  //
  // // unpublish
  // it('unpublish', (done) => {
  //   request(sails.hooks.http.app)
  //   .put(`/api/product/unpublish/${testProduct.id}`)
  //   .end((err,res) => {
  //     if(res.statusCode === 500){
  //       return done(err);
  //     }
  //     res.statusCode.should.equal(302);
  //     // res.statusCode.should.equal(200);
  //     // res.body.should.be.Object;
  //     // res.body.isPublish.should.equal(false);
  //     done(err);
  //   });
  // });
  // // end unpublish
  //
  // // delete
  // it('delete', (done) => {
  //   request(sails.hooks.http.app)
  //   .delete(`/api/product/1`)
  //   .end((err,res) => {
  //     if(res.statusCode === 500){
  //       return done(err);
  //     }
  //     res.statusCode.should.equal(302);
  //     done(err);
  //   });
  // });
  // // end delete
  // //
  // it('update', (done) => {
  //   var updateProduct = {
  //     name: 'specUpdated',
  //     description: '10斤裝',
  //     stockQuantity: 10,
  //     price: 999,
  //     image: 'http://localhost:1337/images/product/1.jpg',
  //     isPublish: true,
  //     comment: 'this is a comment.'
  //   };
  //   request(sails.hooks.http.app)
  //   .post(`/api/product/update/${testProduct.id}`)
  //   .send({updateProduct})
  //   .end((err,res) => {
  //     if(res.statusCode === 500){
  //       return done(err);
  //     }
  //     else {
  //       done();
  //     }
  //   });
  // });


});
