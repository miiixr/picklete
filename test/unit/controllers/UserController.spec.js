describe("about User", () => {
  // start

  let testUser = null;
  let userGroupAdmin = null;
  let userGroupVip = null;
  let userGroupBanned = null;
  before(async (done) => {
    userGroupAdmin = await UserGroupService.findOne(1);
    userGroupVip =  await UserGroupService.findOne(2);
    userGroupBanned =  await UserGroupService.findOne(3);
    console.log("\n ### spec userGroupAdmin id =>\n",userGroupAdmin.id);
    console.log("\n ### spec userGroupVip id=>\n",userGroupVip.id);
    console.log("\n ### userGroupBanned id=>\n",userGroupBanned.id);
    var newUser = {
      username: "spec",
      email: "spec@gmail.com",
      password: "spec",
      UserGroupId: userGroupVip.id,
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
      res.body.user.UserGroupId.should.be.number;
      res.body.user.comment.should.be.String;
      done(err);
    });
  });

  it('findByGroup', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/user/group/${testUser.id}`)
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

  it('add', (done) => {
    var user = {
      username: "specAdd",
      email: "specAdd@gmail.com",
      password: "specAdd",
      UserGroupId: userGroupVip.id,
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
      res.body.UserGroupId.should.be.number;
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
      UserGroupId: userGroupBanned.id,
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
      res.body.UserGroupId.should.equal(3);
      done();
    });
  });

  it('setgroup', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/user/setgroup/${userGroupAdmin.id}/${testUser.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.UserGroupId.should.equal(1); // 1 = UserGroupAdmin
      done(err);
    });
  });

  // end
});
