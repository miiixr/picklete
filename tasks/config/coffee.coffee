###*
Compile CoffeeScript files to JavaScript.

---------------------------------------------------------------

Compiles coffeeScript files from `assest/js` into Javascript and places them into
`.tmp/public/js` directory.

For usage docs see:
https://github.com/gruntjs/grunt-contrib-coffee
###
module.exports = (grunt) ->
  grunt.config.set "coffee",
    dev:
      options:
        bare: true
        sourceMap: true
        sourceRoot: "./"

      files: [
        {
          expand: true
          cwd: "assets/javascripts/"
          src: ["**/*.coffee"]
          dest: ".tmp/public/javascripts/"
          ext: ".js"
        }
        {
          expand: true
          cwd: "assets/javascripts/"
          src: ["**/*.coffee"]
          dest: ".tmp/public/javascripts/"
          ext: ".js"
        }
      ]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  return
