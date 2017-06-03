module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: '<%= pkg.name %>.<%= pkg.version %>',
        context: '/iec/manager/',
        lib_scripts: [
            'src/bower_components/jquery/dist/jquery.js',
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-animate/angular-animate.js',
            'src/bower_components/angular-aria/angular-aria.js',
            'src/bower_components/angular-messages/angular-messages.js',
            'src/bower_components/angular-material/angular-material.js',
            'src/bower_components/angular-route/angular-route.js',
            'src/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
            'src/bower_components/leaflet/dist/leaflet.js',
            'src/bower_components/ui-leaflet/dist/ui-leaflet.js',
            'src/bower_components/d3/d3.js',
            'src/bower_components/plotlyjs/plotly.js'
          ],
        client_scripts: [
            'src/js/app.js',
            'src/js/directives/*.js',
            'src/js/components/*.js',
            'src/js/controller/*.js'
        ],
        lib_styles: [
            'src/bower_components/angular-material/angular-material.css',
            'src/bower_components/leaflet/dist/leaflet.css'
        ],
        client_styles: [
            'src/css/**/*.css'
        ],
        copy_files: [
            'templates/**/*.html',
            'img/**/*',
            'doc/**/*',
            '*.json'
        ],
        jshint: {
            files: ['gruntfile.js', 'src/js/**/*.js', 'test/**/*.js'],
            options: {
                // more options here if you want to override JSHint defaults
                reporterOutput: "",
                jshintrc: true
            }
        },
        clean: {
            dist: ["dist/"],
            post: [
                "dist/**/*.js",
                "!dist/**/*.min.js",
                "dist/**/*.css",
                "!dist/**/*.min.css"
            ]
        },
        less: {
            development: {
                options: {
                    paths: ['src/less/**/*.less']
                },
                files: {
                    'src/css/app.css': ['src/less/**/*.less']
                }
            }
        },
        concat: {
            libs: {
                src: ['<%= lib_scripts %>', '<%= client_scripts %>'],
                dest: 'dist/js/<%= name %>.js'
            },
            styles: {
                src: ['<%= lib_styles %>', '<%= client_styles %>'],
                dest: 'dist/css/<%= name %>.css'
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015-script']
            },
            libs: {
                src: '<%= concat.libs.dest %>',
                dest: 'dist/js/deps.<%= name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            libs: {
                files: {
                    'dist/js/<%= name %>.min.js': ['<%= babel.libs.dest %>']
                }
            }
        },
        cssmin: {
            styles: {
                files: {
                    'dist/css/<%= name %>.min.css': ['<%= concat.styles.dest %>']
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    flatten: false,
                    cwd: 'src/',
                    src: '<%= copy_files %>',
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            }
        },
        tags: {
            options: {
                scriptTemplate: '<script src="{{ path }}" type="text/javascript"></script>',
                linkTemplate: '<link href="{{ path }}" rel="stylesheet" type="text/css"/>'
            },
            scripts: {
                options: {
                    openTag: '<!-- start scripts -->',
                    closeTag: '<!-- end scripts -->'
                },
                src: ['<%= lib_scripts %>', '<%= client_scripts %>'],
                dest: 'src/index.html'
            },
            styles: {
                options: {
                    openTag: '<!-- start style -->',
                    closeTag: '<!-- end style -->'
                },
                src: ['<%= lib_styles %>', '<%= client_styles %>'],
                dest: 'src/index.html'
            }
        },
        processhtml: {
            options: {
                data: {
                    context: '<%= context %>',
                    filename: '<%= name %>'
                }
            },
            index: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('env-build', ['less', 'tags']);

    grunt.registerTask('default', ['jshint', 'clean:dist', 'concat', 'less', 'babel', 'uglify', 'cssmin', 'copy', 'processhtml']);
};
