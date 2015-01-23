
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
          options: {
              reporter: require('jshint-stylish')
          },
          all: ['Gruntfile.js',
                'src/*.js']
      },
      compass: {
          dist: {
              options: {
                  sassDir: 'src',
                  cssDir: 'dist'
              }
          }
      },
      watch: {
          css: {
              files: '**/*.scss',
              tasks: ['compass']
          }
      },
      copy: {
          dist: {
              cwd: './src/',
              expand: true,
              flatten: true,
              src: ['*.js', '*.html'],
              dest: 'dist/'
          }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('dist', ['compass', 'copy']);
  grunt.registerTask('default', ['dist']);
};
