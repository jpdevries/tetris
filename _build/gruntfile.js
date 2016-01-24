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
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};
