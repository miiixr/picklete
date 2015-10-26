module.exports = (grunt) ->
  # grunt.registerTask 'test', [ 'mocha_istanbul:coverage' ]
  grunt.registerTask 'test', [ 'mocha_istanbul:coveralls' ]
  return
