describe("about User", () => {
  // start

  let testUser = null;
  before(async (done) => {
    var newUser = {
      username: "spec",
      email: "spec@gmail.com",
      password: "spec",
      group: 1,
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
      res.body.user.group.should.be.number;
      res.body.user.comment.should.be.String;
      done(err);
    });
  });

  it('findAll', (done) => {
    request(sails.hooks.http.app)
    .get(`/api/User`)
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
    var newUser = {
      username: "specAdd",
      email: "specAdd@gmail.com",
      password: "specAdd",
      group: 1,
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
      res.body.id.should.equal(5);
    //  res.body.group.should.be.number;
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
    var updateUser = {
      username: "updated",
      email: "spec@gmail.com",
      password: "spec",
      group: 1,
      comment: "this user has been updated."
    };
    request(sails.hooks.http.app)
    .put(`/api/user/${testUser.id}`)
    .send({updateUser})
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      else {
        done();
      }
    });
  });

  it('setgroup', (done) => {
    request(sails.hooks.http.app)
    .put(`/api/user/setgroup/0/${testUser.id}`)
    .end((err,res) => {
      if(res.statusCode === 500){
        return done(err);
      }
      // res.statusCode.should.equal(302);
      res.statusCode.should.equal(200);
      res.body.should.be.Object;
      res.body.group.should.equal("0");
      done(err);
    });
  });

  // end
});
