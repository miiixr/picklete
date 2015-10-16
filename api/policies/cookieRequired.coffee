###*
cookieRequired

@module      :: Policy
@description :: Simple policy to allow any authenticated user
@docs        :: http://sailsjs.org/#!documentation/policies
###
module.exports = (req, res, next) ->

  # User is allowed, proceed to the next policy,
  # or if this is the last policy, the controller
  cookie = req.cookies

  if !cookie.version or cookie.version < sails.config.cookieVersion
    res.clearCookie('picklete_cart')
    res.cookie('version', sails.config.cookieVersion)

  return next()
