###*
Validate files with JSHint.

---------------------------------------------------------------

For usage docs see:
https://github.com/gruntjs/grunt-contrib-jshint
###
module.exports = (grunt) ->
  grunt.config.set 'jshint',
    all:
      ['api/**/*.js']
    options:
      camelcase: true
      curly: true
      eqeqeq: false
      eqnull: true
      browser: false
      esnext: true
      globals:
        jQuery: true
      reporter: require('jshint-stylish')

  grunt.loadNpmTasks "grunt-contrib-jshint"
  return
