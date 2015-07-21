module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

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
        }
    });
    grunt.registerTask('default', []);
    grunt.registerTask('test', ['browserify:test', 'connect', 'mocha_phantomjs', 'simplemocha']);
    grunt.registerTask('release', ['browserify:dist']);
};
