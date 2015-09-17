module.exports = (grunt) ->
  grunt.registerTask "buildDev", [
    "clean"
    "bower:dev"
    "compileAssets"
    "linkAssets"
  ]
  return
