module.exports = function(grunt) {
  grunt.initConfig({
    dirs:{
      theme:'../',
      assets:'assets/',
      js:'js/'
    },
    browserify: {
      dist: {
        options: {
           transform: [['babelify', {presets: ['es2015']}]]
        },
        files : {
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.js':'<%= dirs.js %>main.js'
        }
      }
    },
    uglify: {
      js: {
        files: {
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>app.js'
        }
      }
    },
    growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
      sass: {
          message: "Sass files created.",
          title: "grunt"
      },
      build: {
          title: "grunt",
          message: "Build complete."
      },
      watch: {
          title: "grunt",
          message: "Watching. Grunt has its eye on you."
      },
      concat: {
          title: "grunt",
          message: "JavaScript concatenated."
      },
      uglify: {
          title: "grunt",
          message: "JavaScript minified."
      }
    },
    watch: { /* trigger tasks on save */
      options: {
          livereload: true
      },
      scss: {
          options: {
              livereload: false
          },
          files: '<%= dirs.scss %>**/*.scss',
          tasks: ['sass:dev', 'growl:sass']
      },
      js: {
          files: ['<%= dirs.js %>**/*.js'],
          tasks: ['browserify','uglify', 'growl:uglify']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-growl');

  grunt.registerTask('build',['browserify','uglify']);
};
