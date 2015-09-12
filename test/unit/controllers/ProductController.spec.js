  import path from 'path';

describe("about Product", () => {

  let testProduct = null;
  var cookie;

  before(async (done) => {
    let newProduct = {
      name: '斗六文旦柚禮盒',
      description: '3斤裝',
      stockQuantity: 10,
      price: 100,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
    };

    testProduct = await db.Product.create(newProduct);

    request(sails.hooks.http.app)
    .post('/auth/local')
    .send({ identifier: 'admin', password: 'admin' })
    .end(function (err, res) {
      cookie = res.headers['set-cookie'];
      return done();
    });
    // done();

  });

  it('one', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/product/${testProduct.id}`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.product.should.be.Object;
      res.body.product.id.should.be.number;
      res.body.product.image.should.be.String;

      done(err);

    });
  });

  it('all', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/product`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.products.should.be.Array;

      res.body.products.forEach(product => {
        product.image.should.be.String;
      });
      done(err);
    });
  });

  it('update', (done) => {
    var updateProduct = {
      name: 'specUpdated',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
    };
    request(sails.hooks.http.app)
    .post(`/api/product/update/${testProduct.id}`)
    .send({updateProduct})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      else {
        done();
      }
    });
  });

  it('add', (done) => {
    var product = {
      name: 'specAdd',
      description: '10斤裝',
      stockQuantity: 10,
      price: 999,
      image: 'http://localhost:1337/images/product/1.jpg',
      isPublish: true,
      comment: 'this is a comment.'
    };
    request(sails.hooks.http.app)
    .post(`/api/product/`)
    .send({product})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.name.should.equal("specAdd");
      res.body.id.should.be.number;
      done(err);
    });
  });

  it('delete', (done) => {
    request(sails.hooks.http.app)
    .delete(`/api/product/1`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(302);
      done(err);
    });
  });

  it('publish', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/product/publish/${testProduct.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.isPublish.should.equal(true);
      done(err);
    });
  });

  it('unpublish', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/product/unpublish/${testProduct.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.isPublish.should.equal(false);
      done(err);
    });
  });

  it('create a product for one type, origin brandType, test about - ProductController.createUpdate', (done) => {

    request(sails.hooks.http.app)
    .post('/admin/goods/create')
    .set('cookie', cookie)
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
    .set('cookie', cookie)
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
    .set('cookie', cookie)
    .field('brandType', 'other') // other, PRIEM, AGENT
    .field('brandName', 'otherBrand')
    .field('brandId', 1)
    .field('dptId', '1')
    .field('dptId', '2')
    .field('dptId', '3')
    .field('dptSubId', '1')
    .field('dptSubId', '4')
    .field('dptSubId', '8')
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
    .field('good[color]', 1)
    .field('good[color]', 2)
    .field('good[description]', '款式 1')
    // .field('good[][description]', '款式 2')
    .field('good[productNumber]', 'productNumber1')
    .field('good[productNumber]', 'productNumber2')
    .field('good[stockQuantity]', 999)
    .field('good[stockQuantity]', 999)
    .field('good[photos-1]', 'http://i.imgur.com/TeVEDMX.png')  // 1
    .field('good[photos-1]', 'http://i.imgur.com/TeVEDMX.png')  // 1
    .field('good[photos-2]', 'http://i.imgur.com/AD0FyWG.png')  // 1
    .field('good[photos-2]', 'http://i.imgur.com/AD0FyWG.png')  // 1
    .field('good[isPublish]', 'true')
    .field('good[isPublish]', 'false')
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

});
