/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var url = require('url');
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
    let reference = url.parse(req.headers.referer);
    let referencePath = reference.path.split('/');

    req.session.authenticated = false;

    req.logout();

    if (referencePath[1] === 'admin') {
      return res.redirect('/admin/login');
    }
    return res.redirect('/login');

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
          let reference = url.parse(req.headers.referer);
          if (reference.path === '/admin/login') {
            res.redirect('/admin/login');
          }else {
            res.redirect('/login');
          }

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
        req.session.authenticated = true;
        console.log('=== user.Roles ===', user);

        if (user.Role.authority == 'admin') {
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
