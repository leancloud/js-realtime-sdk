/* eslint-disable */
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var SAUCE_BROWSERS = [
    {
      //    browserName: 'firefox',
      //    version: '46',
      //    platform: 'Windows 7'
      //  }, {
      browserName: 'iPhone',
      version: '8.4',
    },
    {
      //    browserName: 'chrome',
      //    version: 'latest',
      //    platform: 'Windows 7'
      //  }, {
      browserName: 'chrome',
      version: '31',
    },
  ];

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8000,
          base: '',
        },
      },
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:8000/test/browser/'],
          build: process.env.TRAVIS_JOB_NUMBER,
          testname:
            'LeanCloud Realtime SDK Test #' +
            (process.env.TRAVIS_COMMIT || '').slice(0, 7),
          browsers: SAUCE_BROWSERS,
          throttled: 1,
          pollInterval: 3000,
          statusCheckAttempts: 200,
          tunnelArgs: ['--vm-version', 'dev-varnish'],
        },
      },
    },
  });
  grunt.registerTask('default', []);
  grunt.registerTask('test-browser', '', function() {
    var tasks = [];
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      tasks = tasks.concat(['connect', 'saucelabs-mocha']);
    } else {
      grunt.log.writeln(
        'Saucelabs test skipped, set SAUCE_USERNAME and SAUCE_ACCESS_KEY to start it.'
      );
      grunt.log.writeln(
        'To run browser tests locally, start a static server then run ./test/browser/'
      );
    }
    grunt.task.run(tasks);
  });

  var espree = require('espree');
  grunt.registerTask('validate-es5', 'validate es5', function() {
    [
      './plugins/typed-messages/dist/typed-messages.js',
      './plugins/webrtc/dist/webrtc.js',
      './plugins/groupchat-receipts/dist/groupchat-receipts.js',
      './plugins/live-query/dist/live-query.js',
      './dist/realtime.browser.js',
      './dist/realtime.weapp.js',
    ].forEach(file => {
      grunt.log.write('validate ' + file + ' ');
      var code = fs.readFileSync(file);
      espree.parse(code, {
        ecmaVersion: 5,
      });
      grunt.log.ok();
    });
  });
};
