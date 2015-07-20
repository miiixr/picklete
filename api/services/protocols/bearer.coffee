###
# Bearer Authentication Protocol
#
# Bearer Authentication is for authorizing API requests. Once
# a user is created, a token is also generated for that user
# in its passport. This token can be used to authenticate
# API requests.
#
###

exports.authorize = (token, done) ->
  db.Passport.findOne({
    where: {accessToken: token }
  }).then (passport) ->
    if !passport
      return done(null, false)
    db.User.findById(passport.user).then (user) ->
      if !user
        return done(null, false)
      done null, user, scope: 'all'
    return
  return
