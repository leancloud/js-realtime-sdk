module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var SAUCE_BROWSERS = [{
    browserName: 'chrome'
  }, {
    browserName: 'internet explorer',
    version: '10.0'
  }];

  var HINT_SRCS = ['src/**/*.js', 'test/**/*.js', 'demo/**/*.js', '*.js', '!**/*.browser.js'];

  grunt.initConfig({
    watch: {
      scripts: {
        files: HINT_SRCS,
        tasks: ['hint', 'release']
      },
    },
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'lib/'
        }]
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/AV.realtime.js': ['lib/AV.realtime.js']
        }
      },
      test: {
        files: {
          'test/browser/specs.browser.js': 'test/specs.js'
        },
        options: {
          transform: ['envify']
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
        timeout: 20000,
        ui: 'bdd'
      },
      all: {
        src: ['test/specs.js']
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
          browsers: SAUCE_BROWSERS,
          throttled: 3,
          tunnelArgs: ['--vm-version', 'dev-varnish']
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
  grunt.registerTask('sauce', ['babel', 'browserify:test', 'connect', 'saucelabs-mocha']);
  grunt.registerTask('test', '', function() {
    var tasks = ['hint', 'babel', 'browserify:test', 'connect', /*'mocha_phantomjs',*/ 'simplemocha'];
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      tasks.push('saucelabs-mocha');
    } else {
      grunt.log.writeln('Skip saucelabs test, set SAUCE_USERNAME and SAUCE_ACCESS_KEY to start it.');
    }
    grunt.task.run(tasks);
  });
  grunt.registerTask('release', ['babel', 'browserify:dist', 'uglify:dist']);
  grunt.registerTask('dev', ['hint', 'release', 'connect', 'watch']);
  grunt.registerTask('cdn', 'Upload dist to CDN.', function() {

    grunt.task.requires('release');
    var done = this.async();
    var version = require('./package.json').version;
    uploadCDN('./dist/AV.realtime.js', version, function() {
      uploadCDN('./dist/AV.realtime.min.js', version, done);
    });
  });
  grunt.registerTask('upload', ['release', 'cdn']);

  var qiniu = require('qiniu');
  var path = require('path');
  var fs = require('fs');

  qiniu.conf.ACCESS_KEY = process.env.CDN_QINIU_KEY;
  qiniu.conf.SECRET_KEY = process.env.CDN_QINIU_SECRET;

  function uploadCDN(file, version, cb) {
    var bucketname = 'paas_files';
    var key = 'static/js/' + path.basename(file, '.js') + '-' +
      version + '.js';
    var putPolicy = new qiniu.rs.PutPolicy(bucketname + ':' + key);
    var uptoken = putPolicy.token();
    var extra = new qiniu.io.PutExtra();
    extra.mimeType = 'application/javascript';
    var buffer = fs.readFileSync(file);
    qiniu.io.put(uptoken, key, buffer, extra, function(err, ret) {
      if (!err) {
        console.log('https://cdn1.lncld.net/' + ret.key);
      } else {
        console.log(err);
      }
      cb();
    });
  }

};
