
module.exports = function(grunt) {

  var shell = require('shelljs');
  var semver = require('semver');

  var DISTDIR = 'dist';

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

  function run(cmd, msg){
    shell.exec(cmd, {silent:true});
    grunt.log.ok('cmd : '+cmd);
    if( msg ){
      grunt.log.ok(msg);
    }
  }

  grunt.registerTask('release-prepare', 'Set up submodule to receive a new release', function() {
    // Make sure we have the submodule in dist
    run("git submodule init");
    run("git submodule update");
    run("cd dist; git checkout master");
    // Bump version
    var newVer = grunt.config('pkg').version;
    var comp = grunt.file.readJSON(DISTDIR+"/bower.json");
    grunt.log.writeln("Package version: " + newVer);
    grunt.log.writeln("Component version: " + comp.version);
    if (!semver.gt(newVer, comp.version)) {
      grunt.warn("Need to up-version package.json first!");
    }
  });


  grunt.registerTask('release-commit', 'push new build to bower component repo', function() {
    // Stamp version
    var newVer = grunt.config('pkg').version;
    var comp = grunt.file.readJSON(DISTDIR+"/bower.json");
    grunt.log.writeln("Package version: " + newVer);
    grunt.log.writeln("Component version: " + comp.version);
    if (!semver.gt(newVer, comp.version)) {
      grunt.warn("Need to up-version package.json first!");
    }
    comp.version = newVer;
    grunt.file.write(DISTDIR+"/bower.json", JSON.stringify(comp, null, '  ')+'\n');
    // Commit submodule
    // Tag submodule
    run('cd dist; git commit -a -m"Build version '+ newVer +'"', "Commited to bower repo");
    run('cd dist; git tag ' + newVer + ' -m"Release version '+ newVer +'"', "Tagged bower repo");
    // Commit and tag this.
    run('git commit -a -m"Build version '+ newVer +'"', "Commited to source repo");
    run('git tag ' + newVer + ' -m"Release version '+ newVer +'"', "Tagged source repo");
    run("git submodule update");
    // push?
    grunt.log.ok("DON'T FORGET TO PUSH BOTH!");
  });

  grunt.registerTask('release', 'build and push to the bower component repo',
                     ['release-prepare', 'dist', 'release-commit']);
  
};
