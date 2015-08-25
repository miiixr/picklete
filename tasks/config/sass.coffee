module.exports = (grunt) ->
  grunt.config.set "sass",
    dev:
      options:
        compass: true

      files: [
        expand: true
        cwd: "assets/stylesheets/"
        src: [
          "importer.scss"
          "bootstrap.scss"
        ]
        dest: ".tmp/public/stylesheets/"
        ext: ".css"
      ]

  grunt.loadNpmTasks "grunt-contrib-sass"
  return
