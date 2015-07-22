module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // var SAUCE_BROWSERS = [{
    //     browserName: 'internet explorer',
    //     version: '11.0'
    // }, {
    //     browserName: 'internet explorer',
    //     version: '10.0'
    // }, {
    //     browserName: 'internet explorer',
    //     version: '9.0'
    // }, {
    //     browserName: 'internet explorer',
    //     version: '8.0'
    // }, {
    //     browserName: 'internet explorer',
    //     version: '6.0'
    // }];

    var SAUCE_BROWSERS = [{
        browserName: 'chrome'
    }, {
        browserName: 'firefox'
    }];

    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'dist/AV.realtime.js': ['src/***.js']
                }
            },
            test: {
                files: {
                    'test/browser/runner.browser.js': 'test/browser/runner.js'
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
        mocha_phantomjs: {
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
        }
    });
    grunt.registerTask('default', []);
    grunt.registerTask('test', ['browserify:test', 'connect', 'mocha_phantomjs', 'simplemocha']);
    grunt.registerTask('saucelabs', ['browserify:test', 'connect', 'saucelabs-mocha']);
    grunt.registerTask('release', ['browserify:dist']);
};
