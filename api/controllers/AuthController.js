/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController;

AuthController = {

  admin: (req, res) => {
    return res.redirect('/admin/goods');
  },

  login: function(req, res) {
    res.view('admin/login', {
      errors: req.flash('error')
    });
  },
  logout: function(req, res) {
    req.logout();
    req.session.authenticated = false;
    res.redirect('/admin/login');
  },
  register: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  provider: function(req, res) {
    passport.endpoint(req, res);
  },
  callback: function(req, res) {
    var tryAgain;
    tryAgain = function(err) {
      var action, flashError;
      flashError = req.flash('error')[0];
      if (err && !flashError) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);
      action = req.param('action');
      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          res.redirect('/login');
      }
    };
    passport.callback(req, res, function(err, user, challenges, statuses) {
      if (err || !user) {
        return tryAgain(challenges);
      }
      req.login(user, function(err) {
        if (err) {
          return tryAgain(err);
        }
        console.log(user);
        req.session.authenticated = true;

        if (user.RoleId == 2) {
          return res.redirect('/admin/goods');
        }
        return res.redirect('/');
      });
    });
  },
  disconnect: function(req, res) {
    passport.disconnect(req, res);
  }
};

module.exports = AuthController;
