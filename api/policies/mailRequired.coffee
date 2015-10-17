###*
mailRequired

@module      :: Policy
@description :: Simple policy to allow any authenticated user
@docs        :: http://sailsjs.org/#!documentation/policies
###
module.exports = (req, res, next) ->

  # User is allowed, proceed to the next policy,
  # or if this is the last policy, the controller
  referer = req.path.split('/')
  if UserService.getLoginState(req)
    userInfo = UserService.getLoginUser(req)
    console.log '=== userInfo ===',userInfo
    if userInfo.hasOwnProperty('email')
      return next()
    else
      return res.redirect('/member/setting')
  else
    return next()
