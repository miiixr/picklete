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
  return next() if UserService.getLoginState(req)

  # User is not allowed

  if referer['1'] is 'admin'
    return res.redirect('/admin/login')
  else
    return res.redirect('/')
