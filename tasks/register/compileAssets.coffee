module.exports = (grunt) ->
  grunt.registerTask "compileAssets", [
    "clean:dev"
    "jst:dev"
    # "less:dev"
    # "sass:dev"
    "copy:dev"
    "coffee:dev"
  ]
  return
