###*
grunt/pipeline.js

The order in which your css, javascript, and template files should be
compiled and linked from your views and static HTML files.

(Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
for matching multiple files.)
###

# CSS files to inject in order
#
# (if you're using LESS with the built-in default config, you'll want
#  to change `assets/styles/importer.less` instead.)
cssFilesToInject = ["stylesheets/**/*.css"]

# Client-side javascript files to inject in order
# (uses Grunt-style wildcard/glob/splat expressions)
jsFilesToInject = [
  
  # Load sails.io before everything else
  "bower/typeahead.js/dist/bloodhound.min.js"
  "bower/typeahead.js/dist/typeahead.jquery.min.js"
  "bower/**/*.js"
  "javascripts/plugin/bootstrap.js"
  "javascripts/**/*.js"
  "javascripts/login.js"
  "js/dependencies/sails.io.js"
  
  # Dependencies like jQuery, or Angular are brought in here
  "js/dependencies/**/*.js"

  
  # All of the rest of your client-side js files
  # will be injected here in no particular order.
  "js/app/app.js"
]

# Client-side HTML templates are injected using the sources below
# The ordering of these templates shouldn't matter.
# (uses Grunt-style wildcard/glob/splat expressions)
#
# By default, Sails uses JST templates and precompiles them into
# functions for you.  If you want to use jade, handlebars, dust, etc.,
# with the linker, no problem-- you'll just want to make sure the precompiled
# templates get spit out to the same file.  Be sure and check out `tasks/README.md`
# for information on customizing and installing new tasks.
templateFilesToInject = ["templates/**/*.html"]

# Prefix relative paths to source files so they point to the proper locations
# (i.e. where the other Grunt tasks spit them out, or in some cases, where
# they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map((path) ->
  ".tmp/public/" + path
)
module.exports.jsFilesToInject = jsFilesToInject.map((path) ->
  ".tmp/public/" + path
)
module.exports.templateFilesToInject = templateFilesToInject.map((path) ->
  "assets/" + path
)
