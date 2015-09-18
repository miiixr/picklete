module.exports = (grunt) ->
  grunt.registerTask "default", [
    "clean"
    "bower:dev"
    "compileAssets"
    "linkAssets"
    "watch"
  ]
  return
