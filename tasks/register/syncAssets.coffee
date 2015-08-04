module.exports = (grunt) ->
  grunt.registerTask "syncAssets", [
    "jst:dev"
    "less:dev"
    "sass:dev"
    "sync:dev"
    "coffee:dev"
  ]
  return
