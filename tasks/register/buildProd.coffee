module.exports = (grunt) ->
  grunt.registerTask "buildProd", [
    "compileAssets"
    "concat"
    "uglify"
    "cssmin"
    "linkAssetsBuildProd"
    "clean:build"
    "copy:build"
  ]
  return
