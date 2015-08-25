# UserService =
#   getLoginState: (req) ->
#     if req.session.authenticated
#       return true
#     else
#       return false
#
#   getLoginUser: (req) ->
#     if req.session.passport.user
#       return req.session.passport.user
#     else
#       return false
#
# module.exports = UserService
