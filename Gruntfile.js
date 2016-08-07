/* eslint-disable */
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var nodeResolve = require('rollup-plugin-node-resolve');
  var json = require('rollup-plugin-json');
  var babel = require('rollup-plugin-babel');
  var commonjs = require('rollup-plugin-commonjs');

  var env = function () {
    var envString = JSON.stringify(process.env);
    return {
      intro() {
        return `
var process = window.process || {};
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
var define = undefined;
var require = require || function(id) {throw new Error('Unexpected required ' + id)};
`;
      }
    };
  };

  var SAUCE_BROWSERS = [{
   browserName: 'firefox',
    version: '46',
    platform: 'Windows 7'
  }, {
    browserName: 'iPhone',
    version: '8.4'
  }, {
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 7'
  }, {
    browserName: 'chrome',
    version: '31'
  }];

  var babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
  var babelConfigs = Object.assign(babelrc, {
    plugins: babelrc.plugins,
    presets: [["es2015", { "modules": false }]],
    babelrc: false,
    runtimeHelpers: true,
  });

  grunt.initConfig({
    rollup: {
      options: {
        sourceMap: true
      },
      dist: {
        dest: 'dist/realtime.js',
        src: 'src/index.js',
        options: {
          plugins: [
            json(),
            babel(Object.assign({}, babelConfigs, {
              exclude: 'node_modules/**',
            })),
            commonjs({
              include: ['proto/**'],
            })
          ],
          format: 'cjs'
        }
      },
      'dist-browser': {
        dest: 'dist/realtime.browser.js',
        src: 'src/index.js',
        options: {
          plugins: [
            json(),
            nodeResolve({
              main: true,
              browser: true
            }),
            commonjsGlobal(),
            commonjs({
              include: ['node_modules/**', 'proto/**'],
            }),
            babel(Object.assign({}, babelConfigs, {
              include: ['src/**', 'test/**', 'proto/**', 'node_modules/axios/**'],
            })),
            env(),
          ],
          format: 'umd',
          moduleName: 'AV',
          moduleId: 'leancloud-realtime',
        }
      },
      'test-browser': {
        dest: 'test/browser/index.js',
        src: 'test/index.js',
        options: {
          plugins: [
            json(),
            nodeResolve({
              main: true,
              browser: true
            }),
            commonjsGlobal(),
            commonjs({
              include: ['node_modules/**', 'proto/**'],
            }),
            babel(Object.assign({}, babelConfigs, {
              include: ['src/**', 'test/**', 'proto/**', 'node_modules/axios/**'],
            })),
            env()
          ],
          format: 'umd',
          moduleName: 'AV'
        }
      },
      'typed-messages': {
        dest: 'plugins/typed-messages/dist/typed-messages.js',
        src: 'plugins/typed-messages/src/index.js',
        options: {
          plugins: [
            json(),
            babel(Object.assign({}, babelConfigs, {
              exclude: 'node_modules/**',
            })),
            nodeResolve({
              main: true,
            }),
            commonjs({
              include: ['node_modules/**', 'typed-messages'],
            }),
          ],
          format: 'umd',
          moduleName: 'AV',
          moduleId: 'typed-messages',
          external: ['leancloud-realtime', 'leancloud-storage'],
          globals: {
            'leancloud-realtime': 'AV',
            'leancloud-storage': 'AV',
          },
        }
      },
      'webrtc': {
        dest: 'plugins/webrtc/dist/webrtc.js',
        src: 'plugins/webrtc/src/index.js',
        options: {
          plugins: [
            json(),
            babel(Object.assign({}, babelConfigs, {
              exclude: 'node_modules/**',
            })),
            nodeResolve({
              main: true,
            }),
            commonjs({
              include: ['node_modules/**'],
            }),
          ],
          format: 'umd',
          moduleName: 'AV',
          moduleId: 'webrtc',
          external: ['leancloud-realtime'],
          globals: {
            'leancloud-realtime': 'AV',
          },
        }
      },
    },
    envify: {
      'test-browser': {
        files: {
          'test/browser/index.env.js': ['test/browser/index.js']
        }
      }
    },
    uglify: {
      browser: {
        options: {
          sourceMap: true,
          sourceMapIn: 'dist/realtime.browser.js.map'
        },
        files: {
          'dist/realtime.browser.min.js': ['dist/realtime.browser.js']
        }
      },
      'typed-messages': {
        options: {
          sourceMap: true,
          sourceMapIn: 'plugins/typed-messages/dist/typed-messages.js.map'
        },
        files: {
          'plugins/typed-messages/dist/typed-messages.min.js': ['plugins/typed-messages/dist/typed-messages.js']
        }
      },
      webrtc: {
        options: {
          sourceMap: true,
          sourceMapIn: 'plugins/webrtc/dist/webrtc.js.map'
        },
        files: {
          'plugins/webrtc/dist/webrtc.min.js': ['plugins/webrtc/dist/webrtc.js']
        }
      },
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: ''
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:8000/test/browser/'],
          build: process.env.TRAVIS_JOB_NUMBER,
          testname: 'LeanCloud Realtime SDK Test #' + (process.env.TRAVIS_COMMIT || '').slice(0, 7),
          browsers: SAUCE_BROWSERS,
          throttled: 2,
          pollInterval: 3000,
          statusCheckAttempts: 200,
          tunnelArgs: ['--vm-version', 'dev-varnish']
        }
      }
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('build-test', ['rollup:test-browser', 'envify:test-browser']);
  grunt.registerTask('test-browser', '', function() {
    var tasks = ['build-test'];
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      tasks = tasks.concat(['connect', 'saucelabs-mocha']);
    } else {
      grunt.log.writeln('Saucelabs test skipped, set SAUCE_USERNAME and SAUCE_ACCESS_KEY to start it.');
      grunt.log.writeln('To run browser tests locally, start a static server then run ./test/browser/');
    }
    grunt.task.run(tasks);
  });
  grunt.registerTask('build', [
    'rollup:dist-browser',
    'rollup:dist',
    'uglify:browser',
    'rollup:typed-messages',
    'uglify:typed-messages',
    'rollup:webrtc',
    'uglify:webrtc',
    'validate-es5'
  ]);
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

  var espree = require('espree');
  grunt.registerTask('validate-es5', 'validate es5', function() {
    [
      './plugins/typed-messages/dist/typed-messages.js',
      './plugins/webrtc/dist/webrtc.js',
      './dist/realtime.browser.js'
    ].forEach(file => {
      grunt.log.write('validate ' + file + ' ');
      var code = fs.readFileSync(file);
      espree.parse(code, {
        ecmaVersion: 5,
      });
      grunt.log.ok();
    })
  });
};
