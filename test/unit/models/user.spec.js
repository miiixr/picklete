describe("about User model operation.", function() {
  it('create User with admin', function(done) {
    let newUser = {
      username: 'TestUser01',
      email: 'TestUser01@test.com',
      admin: true
    };
    db.User.create(newUser).then(function(createdUser) {
      createdUser.dataValues.admin.should.equal(true);
      return done();
    });
  });
  it('create User with user', function(done) {
    let newUser = {
      username: 'TestUser02',
      email: 'TestUser02@test.com',
      admin: false
    };
    db.User.create(newUser).then(function(createdUser) {
      createdUser.dataValues.admin.should.equal(false);
      return done();
    });
  });
});
