###*
Grunt task for JSCS

---------------------------------------------------------------

For usage docs see:
https://github.com/jscs-dev/grunt-jscs/
###
module.exports = (grunt) ->
  grunt.config.set 'jscs',
    src: "api/**/*.js"
    options:
      config: '.jscsrc'
      esnext: true
      verbose: true
      requireCurlyBraces: []

  grunt.loadNpmTasks "grunt-jscs"
  return
