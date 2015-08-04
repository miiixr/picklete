
module.exports = (grunt) ->
  grunt.config.set "bower",
    dev:
      options:
        layout: "byComponent"
        targetDir: './assets/bower'
        install: true
        cleanTargetDir: true

    prod:
      options:
        layout: "byComponent"
        targetDir: './assets/bower'
        install: true
        cleanTargetDir: true
        cleanBowerDir: true

  grunt.loadNpmTasks 'grunt-bower-task'
  return
