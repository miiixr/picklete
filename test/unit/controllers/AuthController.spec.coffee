describe "about Auth", (done) ->

  it "execute login by id", (done) ->
    loginUser = {
      identifier: "admin"
      password: "admin"
    }

    request(sails.hooks.http.app)
    .post("/auth/local")
    .send(loginUser)

    .expect 'Location', "/"
    .end (err, res) ->
      return done(body) if res.statusCode is 500
      res.statusCode.should.equal 302
      done(err)

  it "execute login by id, but wrong password", (done) ->
    loginUser = {
      identifier: "admin"
      password: "wrong"
    }

    request(sails.hooks.http.app)
    .post("/auth/local")
    .send(loginUser)
    .expect 'Location', "/login"
    .end (err, res) ->
      return done(body) if res.statusCode is 500
      res.statusCode.should.equal 302
      done(err)



  it "execute register", (done) ->

    newUser = {
      username: "testuser"
      email: "testuser@gmail.com"
      password: "testuser"
    }

    request(sails.hooks.http.app).post("/auth/local/register")
    .send(newUser)
    .end (err, res) ->
      db.User.findOne({
        where: {
          username: "testuser"
        }
      })

      .then (newUser) ->
        newUser.email.should.equal "testuser@gmail.com"

        done(err)
