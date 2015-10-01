describe('about User model operation.', function() {
  it('create User with admin', async (done) => {
    try {
      let newUser = {
        username: 'TestUser01',
        email: 'TestUser01@test.com',
        admin: true
      };
      let createdUser = await db.User.create(newUser);

      createdUser.dataValues.admin.should.equal(true);
      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });
  
  it('create User with user', async (done) => {
    let newUser = {
      username: 'TestUser02',
      email: 'TestUser02@test.com',
      admin: false
    };
    let createdUser = await db.User.create(newUser);
    createdUser.dataValues.admin.should.equal(false);
    done();
  });
});
