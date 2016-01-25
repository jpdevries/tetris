module.exports = function(grunt) {
  grunt.initConfig({
    dirs:{
      theme:'../',
      assets:'assets/',
      js:'js/'
    },
    browserify: {
      dist: {
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
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build',['browserify','uglify']);
};
