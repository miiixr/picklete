module.exports = (grunt) ->
  grunt.registerTask "build", [
    "compileAssets"
    "linkAssetsBuild"
    "clean:build"
    "copy:build"
  ]
  return
