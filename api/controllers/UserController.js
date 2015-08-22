/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var UserController;

UserController = {
  controlLogin: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  indexSlider: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  password: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  indexExclusive: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  indexTheme: function(req, res) {
    res.view({
      errors: req.flash('error')
    });
  }
};

module.exports = UserController;
