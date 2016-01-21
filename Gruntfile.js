module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var npm = require('rollup-plugin-npm');
  var json = require('rollup-plugin-json');
  var babel = require('rollup-plugin-babel');
  var commonjs = require('rollup-plugin-commonjs');

  var env = function () {
    var envString = JSON.stringify(process.env);
    return {
      intro() {
        return `
window.process = window.process || {};
process.env = process.env || {};`;
      }
    };
  };
  var commonjsGlobal = function () {
    return {
      intro() {
        return `
var global = typeof window !== 'undefined' ? window :
             typeof global !== 'undefined' ? global :
             this;
`;
      }
    };
  };

  var SAUCE_BROWSERS = [{
    browserName: 'chrome'
  }, {
    browserName: 'internet explorer',
    version: '10.0'
  }];

  var HINT_SRCS = ['src/**/*.js', 'test/**/*.js', 'demo/**/*.js', '!**/browser/**/*.js', '!**/*.browser.js'];

  grunt.initConfig({
    watch: {
      scripts: {
        files: HINT_SRCS,
        tasks: ['lint', 'release']
      },
    },
    eslint: {
      target: HINT_SRCS
    },
    rollup: {
      options: {
        sourceMap: true
      },
      dist: {
        dest: 'dist/bundle.js',
        src: 'src/realtime.js',
        options: {
          plugins: [
            json(),
            babel({ runtimeHelpers: true , exclude: 'node_modules/**' }),
            npm({
              jsnext: true,
              main: true
            }),
            commonjs({
              include: 'node_modules/**',
              namedExports: {
                'rsvp': ['Promise']
              }
            })
          ],
          format: 'cjs'
        }
      },
      'dist-browser': {
        dest: 'dist/bundle.browser.js',
        src: 'src/realtime.js',
        options: {
          plugins: [
            json(),
            babel({ runtimeHelpers: true , exclude: 'node_modules/**' }),
            npm({
              jsnext: true,
              main: true,
              browser: true
            }),
            commonjsGlobal(),
            commonjs({
              include: 'node_modules/**',
              namedExports: {
                'rsvp': ['Promise']
              }
            })
          ],
          format: 'umd',
          moduleName: 'AV.realtime'
        }
      },
      test: {
        dest: 'test/specs.bundle.js',
        src: 'test/specs.js',
        options: {
          plugins: [
            json(),
            babel({ runtimeHelpers: true , exclude: 'node_modules/**' }),
          ],
          format: 'cjs'
        }
      },
      'test-browser': {
        dest: 'test/browser/specs.js',
        src: 'test/specs.js',
        options: {
          plugins: [
            json(),
            babel({ runtimeHelpers: true , exclude: 'node_modules/**' }),
            npm({
              jsnext: true,
              main: true,
              browser: true
            }),
            commonjsGlobal(),
            commonjs({
              include: 'node_modules/**',
              namedExports: {
                'rsvp': ['Promise']
              }
            }),
            env()
          ],
          format: 'umd',
          moduleName: 'AV.realtime'
        }
      }
    },
    envify: {
      'test-browser': {
        files: {
          'test/browser/specs.env.js': ['test/browser/specs.js']
        }
      }
    },
    uglify: {
      browser: {
        options: {
          sourceMap: true,
          sourceMapIn: 'dist/bundle.browser.js.map'
        },
        files: {
          'dist/bundle.browser.min.js': ['dist/bundle.browser.js']
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
        src: ['test/specs.bundle.js']
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
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('lint', [/*'eslint'*/]);
  grunt.registerTask('sauce', ['rollup:test', 'connect', 'saucelabs-mocha']);
  grunt.registerTask('test', '', function() {
    var tasks = ['lint', 'rollup:test', 'rollup:test-browser', 'envify:test-browser', 'connect', /*'mocha_phantomjs',*/ 'simplemocha'];
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      tasks = tasks.concat(['saucelabs-mocha']);
    } else {
      grunt.log.writeln('Skip saucelabs test, set SAUCE_USERNAME and SAUCE_ACCESS_KEY to start it.');
    }
    grunt.task.run(tasks);
  });
  grunt.registerTask('release', ['rollup:dist-browser', 'rollup:dist', 'uglify:browser']);
  grunt.registerTask('dev', ['lint', 'release', 'connect', 'watch']);
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
