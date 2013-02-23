module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: "dist"
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false
      },

      src: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },

      lib: {
        src: 'lib/jquery.history.js',
        dest: 'dist/jquery.history.min.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/specs/*.js']
    },

    copy: {
      main: {
        files: [
          {src: ['src/*'], dest: 'dist/', flatten: true, expand: true, filter: 'isFile'},
          {src: ['lib/*'], dest: 'dist/', flatten: true, expand: true, filter: 'isFile'}
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'uglify']);
};