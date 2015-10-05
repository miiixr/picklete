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
    return res.redirect('/');

  },
  register: async (req, res) => {

    try {
      let likes = await db.Like.findAll();
      let defaultUser = {
        username: '',
        email: '',
        fullName: '',
        gender: '',
        mobile: '',
        birthYear: '1983',
        birthMonth: '01',
        birthDay: '01',
        city: '',
        region: '',
        zipcode: '',
        address: '',
        privacyTermsAgree: false,
        userLikes: []
      }
      let tempUser = req.flash('form');
      let user = defaultUser;

      if(tempUser.length)
        user = tempUser[0];

      if(user.userLikes == undefined) user.userLikes = []

      if(user.email!='' && user.password == user.passwordAgain && user.fullName != '' && user.mobile != '' && user.city != '' && user.region != '' && user.zipcode != ''){
        
        let userCreate = db.User.create(user);
        return res.redirect('/');

      } else{
        
        res.view('user/register.jade', {
          errors: req.flash('error'),
          likes,
          user
        });

      }
    } catch (e) {
      console.error(e.stack);
    }

  },
  provider: function(req, res) {
    passport.endpoint(req, res);
  },
  callback: async function(req, res) {
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
          var reference;
          try {
            reference = url.parse(req.headers.referer);  
          } catch (e) {
            reference = { path : "" };
          }

          if (req.xhr)
            return res.ok({
              status: "fail",
              message: "login fail"
            });
          
          if (reference.path === '/admin/login') {
            res.redirect('/admin/login');
          }else {
            res.redirect('/login');
          }

      }
    };
    await passport.callback(req, res, function(err, user, challenges, statuses) {
      if (err || !user) {
        return tryAgain(challenges);
      }

      req.login(user, function(err) {
        if (err) {
          return tryAgain(err);
        }
        req.session.authenticated = true;

        if (user.Role != undefined && user.Role.authority == 'admin') {
          return res.redirect('/admin/goods');
        }

        console.log('=== user.Role ===', user);

        if (req.xhr)
          return res.ok({
            status: "ok",
            message: "login success"
          });

        return res.redirect('/');
      });
    });
  },
  disconnect: function(req, res) {
    passport.disconnect(req, res);
  }
};

module.exports = AuthController;
