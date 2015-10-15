###*
loginRequired

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
    if userInfo.RoleId == 2
      return next()
    else
      return res.redirect('/')
  # User is not allowed

  if referer['1'] is 'admin'
    return res.redirect('/admin/login')
  else
    return res.redirect('/')
