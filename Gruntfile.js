module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var SAUCE_BROWSERS = [{
    browserName: 'chrome'
  }, {
    browserName: 'firefox'
  }, {
    browserName: 'internet explorer',
    version: '11.0'
  }, {
    browserName: 'internet explorer',
    version: '10.0'
  }, {
    browserName: 'internet explorer',
    version: '9.0'
  }, {
    browserName: 'internet explorer',
    version: '8.0'
  }];

  var HINT_SRCS = ['src/**/*.js', 'test/**/*.js', 'demo/**/*.js', '*.js', '!**/*.browser.js'];

  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'dist/AV.realtime.js': ['src/AV.realtime.js']
        }
      },
      test: {
        files: {
          'test/browser/runner.browser.js': 'test/browser/runner.js'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/AV.realtime.min.js': ['dist/AV.realtime.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: ''
        }
      }
    },
    simplemocha: {
      options: {
        timeout: 10000,
        ui: 'bdd'
      },
      all: {
        src: ['test/runner.js']
      }
    },
    'mocha_phantomjs': {
      all: {
        options: {
          urls: [
            'http://localhost:8000/test/browser/'
          ]
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:8000/test/browser/'],
          build: process.env.CI_BUILD_NUMBER,
          testname: 'Sauce Test for LeanCloud realtime SDK',
          browsers: SAUCE_BROWSERS
        }
      }
    },
    jshint: {
      all: {
        src: HINT_SRCS,
        options: {
          jshintrc: true
        }
      }
    },
    jscs: {
      src: HINT_SRCS
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('hint', ['jshint', 'jscs']);
  grunt.registerTask('test', ['hint', 'browserify:test', 'connect', 'mocha_phantomjs', 'simplemocha']);
  grunt.registerTask('sauce', ['browserify:test', 'connect', 'saucelabs-mocha']);
  grunt.registerTask('release', ['browserify:dist', 'uglify:dist']);
};
