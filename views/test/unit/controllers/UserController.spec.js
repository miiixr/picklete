describe.skip("about User", () => {
  // start

  let testUser = null;
  let roleAdmin = null;
  let roleUser = null;
  before(async (done) => {
    roleAdmin = await UserService.findRole(1);
    roleUser =  await UserService.findRole(2);
    console.log("\n ### spec roleAdmin id =>\n",roleAdmin.id);
    console.log("\n ### spec roleUser id=>\n",roleUser.id);
    var newUser = {
      username: "spec",
      email: "spec@gmail.com",
      password: "spec",
      RoleId: roleUser.id,
      comment: "spec"
    };
    console.log("\n ### spec pre-create user =>\n",newUser);
    testUser = await db.User.create(newUser);
    done();
  });

  it('findOne', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/user/${testUser.id}`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.user.should.be.Object;
      res.body.user.id.should.be.number;
      res.body.user.username.should.be.String;
      res.body.user.email.should.be.String;
      res.body.user.RoleId.should.be.number;
      res.body.user.comment.should.be.String;
      done(err);
    });
  });

  it('findAll', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/user`)
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.users.should.be.Array;
      res.body.users.forEach(User => {
        User.username.should.be.String;
      });
      done(err);
    });
  });

  it('filterByRole', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/user/role/1`) // role admin => 1
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.users.should.be.Array;
      res.body.users.forEach(User => {
        User.username.should.be.String;
      });
      done(err);
    });
  });

  it('search', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/user/search/spec`) // testUser's username=>spec
    .end((err, res) => {
      if (res.statusCode === 500) {
        return done(body)
      }
      res.statusCode.should.equal(200);
      res.body.users.should.be.Array;
      res.body.users.forEach(User => {
        User.username.should.be.equal("spec");
      });
      done(err);
    });
  });

  it('add', (done) => {
    var user = {
      username: "specAdd",
      email: "specAdd@gmail.com",
      password: "specAdd",
      RoleId: roleUser.id,
      comment: "specAdd"
    };
    request(sails.hooks.http.app)
    .post(`/api/user/`)
    .send({user})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.id.should.be.number;
      res.body.username.should.equal("specAdd");
      res.body.RoleId.should.be.number;
      done(err);
    });
  });

  it('delete', (done) => {
    request(sails.hooks.http.app)
    .delete(`/api/user/1`) // this will delete user "admin".
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(302);
      done(err);
    });
  });

  it('update', (done) => {
    var user = {
      username: "specUpdated",
      email: "spec@gmail.com",
      password: "spec",
      RoleId: roleUser.id,
      comment: "this user has been updated."
    };
    request(sails.hooks.http.app)
    .put(`/api/user/${testUser.id}`)
    .send({user})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.username.should.equal("specUpdated");
      res.body.RoleId.should.equal(2);
      done();
    });
  });

  it('setRole', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/user/${testUser.id}/${roleAdmin.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.RoleId.should.equal(1); // 1 = roleAdmin.id
      done(err);
    });
  });

  // end
});
